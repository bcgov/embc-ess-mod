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
    }
}
