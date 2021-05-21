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
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace EMBC.ESS.Shared.Contracts.Submissions
{
    /// <summary>
    /// Search matching evacuation files
    /// </summary>
    public class SearchQuery : Query<SearchQueryResult>
    {
        public IEnumerable<SearchCriteria> SearchParameters { get; set; }
    }

    [JsonConverter(typeof(SearchCriteriaJsonConverter))]
    public abstract class SearchCriteria { }

    public class EvacuationFilesSearchCriteria : SearchCriteria
    {
        public string FileId { get; set; }
        public string PrimaryRegistrantId { get; set; }
        public string PrimaryRegistrantUserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DateOfBirth { get; set; }
        public bool IncludeRestrictedAccess { get; set; }
        public bool IncludeHouseholdMembers { get; set; }
        public EvacuationFileStatus[] IncludeFilesInStatuses { get; set; } = Array.Empty<EvacuationFileStatus>();
    }

    public class RegistrantsSearchCriteria : SearchCriteria
    {
        public string UserId { get; set; }
        public string FileId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DateOfBirth { get; set; }
        public bool IncludeRestrictedAccess { get; set; }
        public bool LeaveSecurityAnswersUnmasked { get; set; } = false;
    }

    public class SearchQueryResult
    {
        public IEnumerable<EvacuationFile> MatchingFiles { get; set; }
        public IEnumerable<RegistrantProfile> MatchingRegistrants { get; set; }
    }

    public class SearchCriteriaJsonConverter : JsonConverter<SearchCriteria>
    {
        public override SearchCriteria Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType != JsonTokenType.StartObject)
            {
                throw new JsonException();
            }

            if (!reader.Read()
                    || reader.TokenType != JsonTokenType.PropertyName
                    || reader.GetString() != "TypeDiscriminator")
            {
                throw new JsonException();
            }

            if (!reader.Read() || reader.TokenType != JsonTokenType.String)
            {
                throw new JsonException();
            }

            SearchCriteria baseClass;
            var typeDiscriminator = (string)reader.GetString();
            switch (typeDiscriminator)
            {
                case nameof(RegistrantsSearchCriteria):
                    if (!reader.Read() || reader.GetString() != "TypeValue")
                    {
                        throw new JsonException();
                    }
                    if (!reader.Read() || reader.TokenType != JsonTokenType.StartObject)
                    {
                        throw new JsonException();
                    }
                    baseClass = (RegistrantsSearchCriteria)JsonSerializer.Deserialize(ref reader, typeof(RegistrantsSearchCriteria));
                    break;

                case nameof(EvacuationFilesSearchCriteria):
                    if (!reader.Read() || reader.GetString() != "TypeValue")
                    {
                        throw new JsonException();
                    }
                    if (!reader.Read() || reader.TokenType != JsonTokenType.StartObject)
                    {
                        throw new JsonException();
                    }
                    baseClass = (EvacuationFilesSearchCriteria)JsonSerializer.Deserialize(ref reader, typeof(EvacuationFilesSearchCriteria));
                    break;

                default:
                    throw new NotSupportedException();
            }

            if (!reader.Read() || reader.TokenType != JsonTokenType.EndObject)
            {
                throw new JsonException();
            }

            return baseClass;
        }

        public override void Write(Utf8JsonWriter writer, SearchCriteria value, JsonSerializerOptions options)
        {
            writer.WriteStartObject();

            if (value is RegistrantsSearchCriteria registrantsSearchCriteria)
            {
                writer.WriteString("TypeDiscriminator", nameof(RegistrantsSearchCriteria));
                writer.WritePropertyName("TypeValue");
                JsonSerializer.Serialize(writer, registrantsSearchCriteria);
            }
            else if (value is EvacuationFilesSearchCriteria evacuationFilesSearchCriteria)
            {
                writer.WriteString("TypeDiscriminator", nameof(EvacuationFilesSearchCriteria));
                writer.WritePropertyName("TypeValue");
                JsonSerializer.Serialize(writer, evacuationFilesSearchCriteria);
            }
            writer.WriteEndObject();
        }
    }
}
