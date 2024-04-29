using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace EMBC.ESS.Engines.Search;

public interface ISearchEngine
{
    public Task<SearchResponse> Search(SearchRequest request, CancellationToken ct = default);
}

public abstract record SearchRequest
{ }

public abstract record SearchResponse
{ }

public record EvacueeSearchRequest : SearchRequest
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string DateOfBirth { get; set; }
    public SearchMode SearchMode { get; set; } = SearchMode.Both;
}

public enum SearchMode
{
    Registrants,
    HouseholdMembers,
    Both
}

public record EvacueeSearchResponse : SearchResponse
{
    public IEnumerable<string> MatchingRegistrantIds { get; set; }
    public IEnumerable<string> MatchingHouseholdMemberIds { get; set; }
}

public abstract record SupportSearchRequest : SearchRequest
{
}

public record PendingPaymentSupportSearchRequest : SupportSearchRequest
{
}

public abstract record SupportSearchResponse : SearchResponse
{
}

public record PendingPaymentSupportSearchResponse : SupportSearchResponse
{
    public IEnumerable<PayableSupport> Supports { get; set; }
}

public record PayableSupport
{
    public string FileId { get; set; }
    public string SupportId { get; set; }
    public string PayeeId { get; set; }
    public decimal Amount { get; set; }
    public PayableSupportDelivery Delivery { get; set; }
}

public abstract record PayableSupportDelivery
{ }

public record PayableSupportInteracDelivery : PayableSupportDelivery
{
    public string NotificationEmail { get; set; }
    public string NotificationPhone { get; set; }
    public string RecipientFirstName { get; set; }
    public string RecipientLastName { get; set; }
}
