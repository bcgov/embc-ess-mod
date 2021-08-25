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

using System;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.ESS.Utilities.Transformation
{
    public interface ITransformatorFactory
    {
        ITransformator CreateFor(TransformationType type);
    }

    public enum TransformationType
    {
        TokensTemplates,
        HandlbarsTemplates
    }

    public class TransformatorFactory : ITransformatorFactory
    {
        private readonly IServiceProvider sp;

        public TransformatorFactory(IServiceProvider sp)
        {
            this.sp = sp;
        }

        public ITransformator CreateFor(TransformationType type) => type switch
        {
            TransformationType.TokensTemplates => sp.GetRequiredService<SuperSimpleTransformator>(),
            TransformationType.HandlbarsTemplates => sp.GetRequiredService<HbsTransformator>(),
            _ => throw new NotImplementedException()
        };
    }
}
