using Microsoft.EntityFrameworkCore;
using RealEstateApi.Model;
using RealEstateApi.Interfaces;

namespace RealEstateApi;

public class CoreContext : DbContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    public DbSet<Advertisement> Advertisements { get; set; }
    public DbSet<Image> Images { get; set; }
    public DbSet<Messages> Messages { get; set; }
    public DbSet<User> Users { get; set; }

    public CoreContext(DbContextOptions options)
    : base(options)
    {
    }

    public CoreContext(DbContextOptions options, IHttpContextAccessor httpContextAccessor)
    : base(options)
    {
        _httpContextAccessor = httpContextAccessor ??
            throw new ArgumentNullException(nameof(httpContextAccessor));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Advertisement>()
            .HasQueryFilter(a => !a.IsDeleted)
            .HasOne<User>(u => u.User)
            .WithMany(r => r.Advertisements)
            .HasForeignKey(a => a.UserId);

        modelBuilder.Entity<Advertisement>()
        .HasMany<Image>(a => a.Images)
        .WithOne()
        .HasForeignKey(a => a.AdvertisementId);

        modelBuilder.Entity<Image>()
            .HasQueryFilter(m => !m.IsDeleted);
        modelBuilder.Entity<Messages>().HasQueryFilter(m => !m.IsDeleted);
        modelBuilder.Entity<User>().HasQueryFilter(u => !u.IsDeleted);
    }

    public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
    {
        SetTimestampedObjectFields();
        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        SetTimestampedObjectFields();
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    private void SetTimestampedObjectFields()
    {
        var baseEntities = ChangeTracker.Entries<ITimestampedObject>().Where(e => e.State == EntityState.Added || e.State == EntityState.Modified).ToList();

        baseEntities.ForEach(e =>
        {
            var entity = e.Entity;
            if (e.State == EntityState.Added)
                entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
        });
    }
}