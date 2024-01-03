using Xunit;
using Moq;
using API.Controllers;
using API.Interfaces;
using API.DTOs;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using API.Entities;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

public class MessagesControllerTests
{
    private readonly Mock<IUnitOfWork> mockUnitOfWork = new Mock<IUnitOfWork>();
    private readonly Mock<IMapper> mockMapper = new Mock<IMapper>();
    private readonly Mock<IUserRepository> mockUserRepository = new Mock<IUserRepository>();
    private readonly Mock<IMessageRepository> mockMessageRepository = new Mock<IMessageRepository>();
    private readonly MessagesController messagesController;

    public MessagesControllerTests()
    {
        mockUnitOfWork.Setup(u => u.UserRepository).Returns(mockUserRepository.Object);
        mockUnitOfWork.Setup(u => u.MessageRepository).Returns(mockMessageRepository.Object);

        messagesController = new MessagesController(mockUnitOfWork.Object, mockMapper.Object)
        {
            ControllerContext = new ControllerContext { HttpContext = SetupHttpContext("michal@wp.pl").Object }
        };
    }

    [Fact]
    public async Task SendsCorrectMessage()
    {
        var sender = new AppUser { Email = "michal@wp.pl" };
        var recipient = new AppUser { Email = "daga@wp.pl" };
        var createMessageDTO = new CreateMessageDTO { RecipientEmail = recipient.Email, Content = "hello" };
        var messageDto = new MessageDTO 
        { 
            SenderEmail = sender.Email, 
            RecipientEmail = recipient.Email, 
            Content = createMessageDTO.Content 
        };

        SetupMockRepositories(sender, recipient);
        mockMapper.Setup(m => m.Map<MessageDTO>(It.IsAny<Message>())).Returns(messageDto);

        var result = await messagesController.CreateMessage(createMessageDTO);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedMessage = Assert.IsType<MessageDTO>(okResult.Value);
        Assert.Equal("hello", returnedMessage.Content);
        Assert.Equal("michal@wp.pl", returnedMessage.SenderEmail);
        Assert.Equal("daga@wp.pl", returnedMessage.RecipientEmail);
    }

    private void SetupMockRepositories(AppUser sender, AppUser recipient)
    {
        mockUserRepository.Setup(r => r.GetUserByEmailAsync(sender.Email)).ReturnsAsync(sender);
        mockUserRepository.Setup(r => r.GetUserByEmailAsync(recipient.Email)).ReturnsAsync(recipient);
        mockMessageRepository.Setup(m => m.AddMessage(It.IsAny<Message>())).Verifiable();
        mockUnitOfWork.Setup(u => u.Complete()).ReturnsAsync(true);
    }

    private Mock<HttpContext> SetupHttpContext(string userEmail)
    {
        var userClaims = new List<Claim> { new Claim(ClaimTypes.Name, userEmail) };
        var mockIdentity = new ClaimsIdentity(userClaims, "TestAuthType");
        var mockUserPrincipal = new ClaimsPrincipal(mockIdentity);
        var mockContext = new Mock<HttpContext>();
        mockContext.SetupGet(c => c.User).Returns(mockUserPrincipal);
        return mockContext;
    }
}
