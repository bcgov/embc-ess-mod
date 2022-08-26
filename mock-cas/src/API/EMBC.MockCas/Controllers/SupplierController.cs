using EMBC.MockCas.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EMBC.MockCas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SupplierController : ControllerBase
    {
        private readonly MockCasDb db;

        public SupplierController(MockCasDb db)
        {
            this.db = db;
        }

        [HttpGet]
        public async Task<ActionResult<List<GetSupplierResponse>>> Get()
        {
            var ret = await db.Suppliers.ToListAsync();
            foreach (var supplier in ret)
            {
                supplier.SupplierAddress = await db.SupplierAddress.Where(s => s.Supplier.Id == supplier.Id).ToListAsync();
            }
            return ret;
        }

        [HttpDelete("{supplierName}")]
        public async Task<ActionResult<int>> DeleteSupplierByName(string supplierName)
        {
            var supplier = db.Suppliers.FirstOrDefault(s => s.Suppliername == supplierName);
            if (supplier == null) return NotFound();

            var addresses = db.SupplierAddress.Include(sa => sa.Supplier).Where(sa => sa.Supplier.Id == supplier.Id).ToList();
            foreach (var address in addresses)
            {
                db.SupplierAddress.Remove(address);
            }
            db.Suppliers.Remove(supplier);
            await db.SaveChangesAsync();

            return supplier.Id;
        }
    }
}
