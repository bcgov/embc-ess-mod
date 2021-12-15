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

using Microsoft.Extensions.Options;
using Microsoft.OData.Client;
using Microsoft.OData.Extensions.Client;

namespace EMBC.ESS.Utilities.Dynamics
{
    public interface IEssContextFactory
    {
        EssContext Create();

        EssContext CreateReadOnly();
    }

    public class EssContextFactory : IEssContextFactory
    {
        private readonly IODataClientFactory odataClientFactory;
        private readonly DynamicsOptions dynamicsOptions;

        public EssContextFactory(IODataClientFactory odataClientFactory, IOptions<DynamicsOptions> dynamicsOptions)
        {
            this.odataClientFactory = odataClientFactory;
            this.dynamicsOptions = dynamicsOptions.Value;
        }

        public EssContext Create() => Create(MergeOption.AppendOnly);

        public EssContext CreateReadOnly() => Create(MergeOption.NoTracking);

        private EssContext Create(MergeOption mergeOption)
        {
            var ctx = odataClientFactory.CreateClient<EssContext>(dynamicsOptions.DynamicsApiBaseUri, "dynamics");
            ctx.MergeOption = mergeOption;
            return ctx;
        }
    }
}
