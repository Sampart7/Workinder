using API.Data;
using API.Interfaces;
using AutoMapper;

namespace API.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _ctx;
        private readonly IMapper _mapper;

        public UnitOfWork(DataContext ctx, IMapper mapper)
        {
            _ctx = ctx;
            _mapper = mapper;
        }

        public IUserRepository UserRepository => new UserRepository(_ctx, _mapper);
        public ILikesRepository LikesRepository => new LikesRepository(_ctx);
        public IMessageRepository MessageRepository => new MessageRepository(_ctx, _mapper);

        public async Task<bool> Complete()
        {
            return await _ctx.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            return _ctx.ChangeTracker.HasChanges();
        }
    }
}