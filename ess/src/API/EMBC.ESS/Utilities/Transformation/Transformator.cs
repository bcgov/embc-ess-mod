// -------------------------------------------------------------------------
//  Copyright © 2021 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMBC.ESS.Utilities.Transformation
{
    public interface ITransformator
    {
        Task<TransformationResult> Transform(TransformationData transformationData);
    }

    public class TransformationData
    {
        public string Template { get; set; }
        public IEnumerable<KeyValuePair<string, string>> Tokens { get; set; }
    }

    public class TransformationResult
    {
        public string Content { get; set; }
    }

    public class SuperSimpleTransformator : ITransformator
    {
        public async Task<TransformationResult> Transform(TransformationData transformationData)
        {
            var transformedTemplate = string.Empty;
            foreach (var token in transformationData.Tokens)
            {
                transformedTemplate = transformedTemplate.Replace($"{{{token.Key}}}", token.Value);
            }

            return await Task.FromResult(new TransformationResult { Content = transformedTemplate });
        }
    }
}
