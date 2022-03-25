using System;
using System.Threading;
using System.Threading.Tasks;

namespace EMBC.Utilities.Caching
{
    public interface ICache
    {
        Task<T?> GetOrSet<T>(string key, Func<Task<T>> getter, TimeSpan expiration, CancellationToken cancellationToken = default);

        Task<T?> Get<T>(string key, CancellationToken cancellationToken = default);

        Task Set<T>(string key, T value, TimeSpan expiration, CancellationToken cancellationToken = default);

        Task Remove(string key, CancellationToken cancellationToken = default);

        Task Refresh<T>(string key, Func<Task<T>> getter, TimeSpan expiration, CancellationToken cancellationToken = default);
    }
}
