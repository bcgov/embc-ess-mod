using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMBC.ESS.Engines.Search
{
    public interface ISearchEngine
    {
        public Task<SearchResponse> Search(SearchRequest request);
    }

    public abstract class SearchRequest
    { }

    public abstract class SearchResponse
    { }

    public class EvacueeSearchRequest : SearchRequest
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

    public class EvacueeSearchResponse : SearchResponse
    {
        public IEnumerable<string> MatchingRegistrantIds { get; set; }
        public IEnumerable<string> MatchingHouseholdMemberIds { get; set; }
    }

    public abstract class SupportSearchRequest : SearchRequest
    {
    }

    public class PendingPaymentSupportSearchRequest : SupportSearchRequest
    {
    }

    public abstract class SupportSearchResponse : SearchResponse
    {
    }

    public class PendingPaymentSupportSearchResponse : SupportSearchResponse
    {
        public IEnumerable<PayableSupport> Supports { get; set; }
    }

    public class PayableSupport
    {
        public string FileId { get; set; }
        public string SupportId { get; set; }
        public string PayeeId { get; set; }
        public decimal Amount { get; set; }
        public PayableSupportDelivery Delivery { get; set; }
    }

    public abstract class PayableSupportDelivery
    { }

    public class PayableSupportInteracDelivery : PayableSupportDelivery
    {
        public string NotificationEmail { get; set; }
        public string NotificationPhone { get; set; }
        public string RecipientFirstName { get; set; }
        public string RecipientLastName { get; set; }
    }
}
