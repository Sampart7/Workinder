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
        private readonly IUnitOfWork _unitOfWork;
        public readonly IMapper _mapper;

        public MessagesController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDTO>> CreateMessage(CreateMessageDTO createMessageDTO)
        {
            var email = User.GetEmail();

            if (email == createMessageDTO.RecipientEmail.ToLower()) 
            return BadRequest("You cannot send messages to yourself");

            var sender = await _unitOfWork.UserRepository.GetUserByEmailAsync(email);
            var recipient = await _unitOfWork.UserRepository.GetUserByEmailAsync(createMessageDTO.RecipientEmail);

            if (recipient == null) return NotFound();

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderEmail = sender.Email,
                RecipientEmail = recipient.Email,
                Content = createMessageDTO.Content
            };

            _unitOfWork.MessageRepository.AddMessage(message);

            if (await _unitOfWork.Complete()) return Ok(_mapper.Map<MessageDTO>(message));

            return BadRequest("Failed to send message");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<MessageDTO>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Email = User.GetEmail();
            var messages = await _unitOfWork.MessageRepository.GetMessagesForUser(messageParams);

            Response.AddPaginationHeader(new PaginationHeader(messages.CurrentPage, messages.PageSize, 
                messages.TotalCount, messages.TotalPages));

            return messages;
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var email = User.GetEmail();
            var message = await _unitOfWork.MessageRepository.GetMessage(id);

            if (email != message.RecipientEmail && email != message.SenderEmail) return Unauthorized();

            if (email == message.RecipientEmail) message.RecipientDeleted = true;
            if (email == message.SenderEmail) message.SenderDeleted = true;

            if (message.RecipientDeleted && message.SenderDeleted) 
            {
                _unitOfWork.MessageRepository.DeleteMessage(message);
            }

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Failed deleting the message");
        }
    }
}