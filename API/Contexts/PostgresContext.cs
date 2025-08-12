using System;
using System.Collections.Generic;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Contexts;

public partial class PostgresContext : DbContext
{
    public PostgresContext()
    {
    }

    public PostgresContext(DbContextOptions<PostgresContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Package> Packages { get; set; }

    public virtual DbSet<PackageRarityType> PackageRarityTypes { get; set; }

    public virtual DbSet<RarityType> RarityTypes { get; set; }

    public virtual DbSet<Toy> Toys { get; set; }

    public virtual DbSet<ToyType> ToyTypes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Name=PostgreSQLConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .HasPostgresEnum("auth", "aal_level", new[] { "aal1", "aal2", "aal3" })
            .HasPostgresEnum("auth", "code_challenge_method", new[] { "s256", "plain" })
            .HasPostgresEnum("auth", "factor_status", new[] { "unverified", "verified" })
            .HasPostgresEnum("auth", "factor_type", new[] { "totp", "webauthn", "phone" })
            .HasPostgresEnum("auth", "one_time_token_type", new[] { "confirmation_token", "reauthentication_token", "recovery_token", "email_change_token_new", "email_change_token_current", "phone_change_token" })
            .HasPostgresEnum("realtime", "action", new[] { "INSERT", "UPDATE", "DELETE", "TRUNCATE", "ERROR" })
            .HasPostgresEnum("realtime", "equality_op", new[] { "eq", "neq", "lt", "lte", "gt", "gte", "in" })
            .HasPostgresExtension("extensions", "pg_stat_statements")
            .HasPostgresExtension("extensions", "pgcrypto")
            .HasPostgresExtension("extensions", "uuid-ossp")
            .HasPostgresExtension("graphql", "pg_graphql")
            .HasPostgresExtension("vault", "supabase_vault");

        modelBuilder.Entity<Package>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("package_pkey");

            entity.ToTable("package");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.Price)
                .HasPrecision(10, 2)
                .HasColumnName("price");
        });

        modelBuilder.Entity<PackageRarityType>(entity =>
        {
            entity.HasKey(e => new { e.PackageId, e.RarityTypeId }).HasName("package_rarity_type_pkey");

            entity.ToTable("package_rarity_type");

            entity.Property(e => e.PackageId).HasColumnName("package_id");
            entity.Property(e => e.RarityTypeId).HasColumnName("rarity_type_id");
            entity.Property(e => e.Ratio).HasColumnName("ratio");

            entity.HasOne(d => d.Package).WithMany(p => p.PackageRarityTypes)
                .HasForeignKey(d => d.PackageId)
                .HasConstraintName("package_rarity_type_package_id_fkey");

            entity.HasOne(d => d.RarityType).WithMany(p => p.PackageRarityTypes)
                .HasForeignKey(d => d.RarityTypeId)
                .HasConstraintName("package_rarity_type_rarity_type_id_fkey");
        });

        modelBuilder.Entity<RarityType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("rarity_pkey");

            entity.ToTable("rarity_type");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("nextval('rarity_id_seq'::regclass)")
                .HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Toy>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("toy_pkey");

            entity.ToTable("toy");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.LuckPercentage)
                .HasPrecision(5, 2)
                .HasColumnName("luck_percentage");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Price)
                .HasPrecision(10, 2)
                .HasColumnName("price");
            entity.Property(e => e.RarityId).HasColumnName("rarity_id");
            entity.Property(e => e.ToyTypeId).HasColumnName("toy_type_id");

            entity.HasOne(d => d.Rarity).WithMany(p => p.Toys)
                .HasForeignKey(d => d.RarityId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("toy_rarity_id_fkey");

            entity.HasOne(d => d.ToyType).WithMany(p => p.Toys)
                .HasForeignKey(d => d.ToyTypeId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("toy_toy_type_id_fkey");
        });

        modelBuilder.Entity<ToyType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("toy_type_pkey");

            entity.ToTable("toy_type");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
        });
        modelBuilder.HasSequence<int>("seq_schema_version", "graphql").IsCyclic();

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
