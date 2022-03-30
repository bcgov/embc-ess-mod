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
            if (value == null) return;
            var type = value.GetType();
            var serializedValue = JsonSerializer.SerializeToNode(value, type, options)?.AsObject() ?? null!;
            serializedValue.Add("_type", type.FullName);
            serializedValue.WriteTo(writer, options);
        }
    }
}
