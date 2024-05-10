using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HandlebarsDotNet;

namespace EMBC.Utilities.Transformation
{
    public interface ITransformator
    {
        Task<TransformationResult> Transform(TransformationData transformationData);
    }

    public class TransformationData
    {
        public string Template { get; set; } = null!;
        public IEnumerable<KeyValuePair<string, string>> Tokens { get; set; } = Array.Empty<KeyValuePair<string, string>>();
    }

    public class TransformationResult
    {
        public string? Content { get; set; }
    }

    public class HbsTransformator : ITransformator
    {
        public async Task<TransformationResult> Transform(TransformationData transformationData)
        {
            var template = Handlebars.Compile(transformationData.Template);

            return await Task.FromResult(new TransformationResult { Content = template(transformationData.Tokens) });
        }
    }
}
