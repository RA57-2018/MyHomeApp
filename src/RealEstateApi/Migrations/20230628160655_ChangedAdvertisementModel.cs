using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RealEstateApi.Migrations
{
    /// <inheritdoc />
    public partial class ChangedAdvertisementModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Advertisements_Image_ImageId",
                table: "Advertisements");

            migrationBuilder.DropForeignKey(
                name: "FK_Advertisements_RealEstates_IdRealEstate",
                table: "Advertisements");

            migrationBuilder.DropForeignKey(
                name: "FK_Advertisements_Users_IdUser",
                table: "Advertisements");

            migrationBuilder.DropTable(
                name: "Image");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Advertisements");

            migrationBuilder.RenameColumn(
                name: "StreetName",
                table: "Location",
                newName: "State");

            migrationBuilder.RenameColumn(
                name: "Number",
                table: "Location",
                newName: "HouseNumber");

            migrationBuilder.RenameColumn(
                name: "Country",
                table: "Location",
                newName: "Road");

            migrationBuilder.RenameColumn(
                name: "RealEstateType",
                table: "Advertisements",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "ImageId",
                table: "Advertisements",
                newName: "RealEstateId");

            migrationBuilder.RenameColumn(
                name: "IdUser",
                table: "Advertisements",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "IdRealEstate",
                table: "Advertisements",
                newName: "AddressId");

            migrationBuilder.RenameIndex(
                name: "IX_Advertisements_ImageId",
                table: "Advertisements",
                newName: "IX_Advertisements_RealEstateId");

            migrationBuilder.RenameIndex(
                name: "IX_Advertisements_IdUser",
                table: "Advertisements",
                newName: "IX_Advertisements_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Advertisements_IdRealEstate",
                table: "Advertisements",
                newName: "IX_Advertisements_AddressId");

            migrationBuilder.AddColumn<double>(
                name: "Lat",
                table: "Location",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Lng",
                table: "Location",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Advertisements",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Advertisements",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Advertisements",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "Advertisements",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Advertisements_Location_AddressId",
                table: "Advertisements",
                column: "AddressId",
                principalTable: "Location",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Advertisements_RealEstates_RealEstateId",
                table: "Advertisements",
                column: "RealEstateId",
                principalTable: "RealEstates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Advertisements_Users_UserId",
                table: "Advertisements",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Advertisements_Location_AddressId",
                table: "Advertisements");

            migrationBuilder.DropForeignKey(
                name: "FK_Advertisements_RealEstates_RealEstateId",
                table: "Advertisements");

            migrationBuilder.DropForeignKey(
                name: "FK_Advertisements_Users_UserId",
                table: "Advertisements");

            migrationBuilder.DropColumn(
                name: "Lat",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "Lng",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Advertisements");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Advertisements");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Advertisements");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Advertisements");

            migrationBuilder.RenameColumn(
                name: "State",
                table: "Location",
                newName: "StreetName");

            migrationBuilder.RenameColumn(
                name: "Road",
                table: "Location",
                newName: "Country");

            migrationBuilder.RenameColumn(
                name: "HouseNumber",
                table: "Location",
                newName: "Number");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Advertisements",
                newName: "IdUser");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Advertisements",
                newName: "RealEstateType");

            migrationBuilder.RenameColumn(
                name: "RealEstateId",
                table: "Advertisements",
                newName: "ImageId");

            migrationBuilder.RenameColumn(
                name: "AddressId",
                table: "Advertisements",
                newName: "IdRealEstate");

            migrationBuilder.RenameIndex(
                name: "IX_Advertisements_UserId",
                table: "Advertisements",
                newName: "IX_Advertisements_IdUser");

            migrationBuilder.RenameIndex(
                name: "IX_Advertisements_RealEstateId",
                table: "Advertisements",
                newName: "IX_Advertisements_ImageId");

            migrationBuilder.RenameIndex(
                name: "IX_Advertisements_AddressId",
                table: "Advertisements",
                newName: "IX_Advertisements_IdRealEstate");

            migrationBuilder.AddColumn<int>(
                name: "City",
                table: "Advertisements",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Image",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Path = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Image", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Advertisements_Image_ImageId",
                table: "Advertisements",
                column: "ImageId",
                principalTable: "Image",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Advertisements_RealEstates_IdRealEstate",
                table: "Advertisements",
                column: "IdRealEstate",
                principalTable: "RealEstates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Advertisements_Users_IdUser",
                table: "Advertisements",
                column: "IdUser",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
