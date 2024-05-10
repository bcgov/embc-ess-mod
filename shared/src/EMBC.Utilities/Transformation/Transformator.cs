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
            Handlebars.RegisterHelper("customComparerDecimalAmount", (writer, context, parameters) =>
            {
                if (!decimal.TryParse(parameters[0]?.ToString(), out decimal value1) || !decimal.TryParse(parameters[1]?.ToString(), out decimal value2))
                {
                    throw new ArgumentException("Invalid parameters for 'customComparerDecimalAmount' helper.");
                }
                writer.WriteSafeString(value1 > value2 ? $"{parameters[2]}: <b>${parameters[0]}</b><br/>" : "");
            });

            var template = Handlebars.Compile(transformationData.Template);

            return await Task.FromResult(new TransformationResult { Content = template(transformationData.Tokens) });
        }
    }
}
