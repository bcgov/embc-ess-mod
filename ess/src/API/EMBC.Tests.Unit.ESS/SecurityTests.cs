using System;
using EMBC.Utilities.Extensions;
using Shouldly;
using Xunit;

namespace EMBC.Tests.Unit.ESS
{
    public class SecurityTests
    {
        [Fact]
        public void CanSha256()
        {
            var str = "to hash";
            var hashed = str.ToSha256();
            hashed.ShouldBe("NIahdg1ZGQENfhhB/+IrOEgdK9SUK7V5XjwlOJ/jgEw=");
        }

        [Fact]
        public void CanEncryptAndDecryptUsingKey()
        {
            var str = "to encrypt";
            var key = Convert.ToBase64String(Guid.NewGuid().ToByteArray());

            var encrypted = str.Encrypt(key);
            encrypted.ShouldNotBe(str);

            var decrypted = encrypted.Decrypt(key);
            decrypted.ShouldBe(str);
        }
    }
}
