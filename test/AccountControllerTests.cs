using Xunit;
using Moq;
using API.Controllers;
using API.Interfaces;
using API.Data;
using AutoMapper;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

public class AccountControllerTests
{
    private DataContext context;
    private AccountController controller;

    public AccountControllerTests()
    {
        var options = new DbContextOptionsBuilder<DataContext>()
            .UseInMemoryDatabase(databaseName: "TestDb")
            .Options;

        context = new DataContext(options);
        var tokenServiceMock = new Mock<ITokenService>();
        var mapperMock = new Mock<IMapper>();

        var password = "1234!Q";
        using var hmac = new HMACSHA512();
        var user = new AppUser
        {
            Email = "michal@wp.pl",
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password)),
            PasswordSalt = hmac.Key
        };

        context.Users.Add(user);
        context.SaveChanges();

        controller = new AccountController(context, tokenServiceMock.Object, mapperMock.Object);
    }

    [Fact]
    public async Task LoginTest()
    {
        var loginDto = new LoginDTO
        {
            Email = "michal@wp.pl",
            Password = "1234!Q"
        };

        var result = await controller.Login(loginDto);

        Assert.IsType<UserDTO>(result.Value);
    }
}