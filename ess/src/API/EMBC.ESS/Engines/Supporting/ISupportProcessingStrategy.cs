using System.Threading.Tasks;

namespace EMBC.ESS.Engines.Supporting
{
    internal interface ISupportProcessingStrategy
    {
        Task<ProcessResponse> Handle(ProcessRequest request);

        Task<ValidationResponse> Handle(ValidationRequest request);
    }
}
