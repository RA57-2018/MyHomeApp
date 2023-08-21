using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RealEstateApi.Migrations
{
    /// <inheritdoc />
    public partial class ModelChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Advertisements_RealEstates_RealEstateId",
                table: "Advertisements");

            migrationBuilder.DropTable(
                name: "RealEstates");

            migrationBuilder.DropIndex(
                name: "IX_Advertisements_RealEstateId",
                table: "Advertisements");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Advertisements");

            migrationBuilder.DropColumn(
                name: "RealEstateId",
                table: "Advertisements");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Advertisements");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Advertisements",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "RealEstateId",
                table: "Advertisements",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "Advertisements",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "RealEstates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LocationId = table.Column<int>(type: "integer", nullable: false),
                    AdvertisementType = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    NameRealEstate = table.Column<string>(type: "text", nullable: false),
                    Price = table.Column<int>(type: "integer", nullable: false),
                    Quadrature = table.Column<int>(type: "integer", nullable: false),
                    RealEstateType = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RealEstates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RealEstates_Location_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Location",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Advertisements_RealEstateId",
                table: "Advertisements",
                column: "RealEstateId");

            migrationBuilder.CreateIndex(
                name: "IX_RealEstates_LocationId",
                table: "RealEstates",
                column: "LocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Advertisements_RealEstates_RealEstateId",
                table: "Advertisements",
                column: "RealEstateId",
                principalTable: "RealEstates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
