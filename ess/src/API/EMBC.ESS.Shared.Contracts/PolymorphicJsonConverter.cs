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
using System.Text.Json;
using System.Text.Json.Serialization;

namespace EMBC.ESS.Shared.Contracts
{
    public class PolymorphicJsonConverter<T> : JsonConverter<T>
    {
        private const string TypePropertyName = "type";
        private const string ValuePropertyName = "type";

        public override T Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType != JsonTokenType.StartObject) throw new JsonException();
            reader.Read();
            if (reader.TokenType != JsonTokenType.PropertyName || reader.GetString() != TypePropertyName) throw new JsonException();
            reader.Read();
            var type = reader.GetString();
            reader.Read();
            if (reader.TokenType != JsonTokenType.PropertyName || reader.GetString() != ValuePropertyName) throw new JsonException();
            reader.Read();
            var value = (T)JsonSerializer.Deserialize(ref reader, Type.GetType(type), options);
            reader.Read();
            if (reader.TokenType != JsonTokenType.EndObject) throw new JsonException();

            return value;
        }

        public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
        {
            var type = value.GetType();
            writer.WriteStartObject();
            writer.WritePropertyName(TypePropertyName);
            writer.WriteStringValue(type.FullName);
            writer.WritePropertyName(ValuePropertyName);
            JsonSerializer.Serialize(writer, value, type, options);
            writer.WriteEndObject();
        }
    }
}
