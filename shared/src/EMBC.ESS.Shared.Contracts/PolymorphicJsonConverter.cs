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
        public override T Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var clonedReader = reader;
            Type type = null;
            while (clonedReader.Read())
            {
                if (clonedReader.TokenType == JsonTokenType.PropertyName)
                {
                    if (clonedReader.GetString() == "_type")
                    {
                        clonedReader.Read();
                        type = Type.GetType(clonedReader.GetString());
                        if (typeToConvert.IsAssignableFrom(type)) break;
                    }
                }
            }
            if (type == null) throw new JsonException("serialized json doesn't have a _type property");
            return (T)JsonSerializer.Deserialize(ref reader, type, options);
        }

        public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
        {
            var type = value.GetType();
            var serializedValue = JsonSerializer.SerializeToNode(value, type, options).AsObject();
            serializedValue.Add("_type", type.FullName);
            serializedValue.WriteTo(writer, options);
        }
    }
}
