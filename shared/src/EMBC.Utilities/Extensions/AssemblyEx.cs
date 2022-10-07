using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace EMBC.Utilities.Extensions
{
    public static class AssemblyEx
    {
        public static async Task<string> GetManifestResourceString(this Assembly assembly, string manifestName)
        {
            using (var stream = assembly.GetManifestResourceStream(manifestName))
            {
                using (var reader = new StreamReader(stream))
                {
                    return await reader.ReadToEndAsync();
                }
            }
        }

        public static Type[] Discover<I>(this Assembly assembly) =>
         assembly.DefinedTypes.Where(t => t.IsClass && !t.IsAbstract && t.IsPublic && typeof(I).IsAssignableFrom(t)).ToArray();

        public static I[] CreateInstancesOf<I>(this Assembly assembly) =>
            assembly.Discover<I>().Select(t => (I)Activator.CreateInstance(t)).ToArray();

        public static bool IsAssignableToGenericType(this Type type, Type genericType)
        {
            var interfaceTypes = type.GetInterfaces();

            foreach (var it in interfaceTypes)
            {
                if (it.IsGenericType && it.GetGenericTypeDefinition() == genericType)
                    return true;
            }

            if (type.IsGenericType && type.GetGenericTypeDefinition() == genericType)
                return true;

            Type baseType = type.BaseType;
            if (baseType == null) return false;

            return IsAssignableToGenericType(baseType, genericType);
        }
    }
}
