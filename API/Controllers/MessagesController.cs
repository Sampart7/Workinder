using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Helpers.Paging;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        public readonly IMessageRepository _messageRepo;
        public readonly IMapper _mapper;

        public MessagesController(IUserRepository userRepo, IMessageRepository messageRepo, 
            IMapper mapper)
        {
            _messageRepo = messageRepo;
            _userRepo = userRepo;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDTO>> CreateMessage(CreateMessageDTO createMessageDTO)
        {
            var email = User.FindFirst(ClaimTypes.Name)?.Value;

            if (email == createMessageDTO.RecipientEmail.ToLower()) return BadRequest("You cannot send messages to yourself");

            var sender = await _userRepo.GetUserByEmailAsync(email);
            var recipient = await _userRepo.GetUserByEmailAsync(createMessageDTO.RecipientEmail);

            if (recipient == null) return NotFound();

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderEmail = sender.Email,
                RecipientEmail = recipient.Email,
                Content = createMessageDTO.Content
            };

            _messageRepo.AddMessage(message);

            if (await _messageRepo.SaveAllAsync()) return Ok(_mapper.Map<MessageDTO>(message));

            return BadRequest("Failed to send message");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<MessageDTO>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Email = User.FindFirst(ClaimTypes.Name)?.Value;
            var messages = await _messageRepo.GetMessagesForUser(messageParams);

            Response.AddPaginationHeader(new PaginationHeader(messages.CurrentPage, messages.PageSize, 
                messages.TotalCount, messages.TotalPages));

            return messages;
        }

        [HttpGet("thread/{email}")]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetMessageThread(string email)
        {
            var currentEmail = User.FindFirst(ClaimTypes.Name)?.Value;
            return Ok(await _messageRepo.GetMessageThread(currentEmail, email));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var email = User.FindFirst(ClaimTypes.Name)?.Value;
            var message = await _messageRepo.GetMessage(id);

            if (email != message.RecipientEmail && email != message.SenderEmail) return Unauthorized();

            if (email == message.RecipientEmail) message.RecipientDeleted = true;
            if (email == message.SenderEmail) message.SenderDeleted = true;

            if (message.RecipientDeleted && message.SenderDeleted) _messageRepo.DeleteMessage(message);

            if (await _messageRepo.SaveAllAsync()) return Ok();

            return BadRequest("Failed deleting the message");
        }

        
    }
}