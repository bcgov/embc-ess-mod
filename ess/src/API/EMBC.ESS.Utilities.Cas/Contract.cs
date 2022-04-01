using System.Threading.Tasks;

namespace EMBC.ESS.Utilities.Cas
{
    public interface ICasInterface
    {
        Task<CasResponse> Call(CasRequest request);
    }

    public abstract class CasResponse
    { }

    public abstract class CasRequest
    { }

    public class CreateSupplierRequest : CasRequest
    { }

    public class CreateSupplierResponse : CasResponse
    { }

    public class QuerySupplierRequest : CasRequest
    { }

    public class QuerySupplierResponse : CasResponse
    { }

    public class SendInvoiceRequest : CasRequest
    { }

    public class SendInvoiceResponse : CasResponse
    { }

    public class QueryInvoiceRequest : CasRequest
    { }

    public class QueryInvoiceResponse : CasResponse
    { }
}
