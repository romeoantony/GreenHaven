IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Categories] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Categories] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Plants] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [ScientificName] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [ImageUrl] nvarchar(max) NOT NULL,
    [StockQuantity] int NOT NULL,
    [LightRequirement] int NOT NULL,
    [WaterNeeds] int NOT NULL,
    [IsPetFriendly] bit NOT NULL,
    [Difficulty] int NOT NULL,
    [CategoryId] int NOT NULL,
    CONSTRAINT [PK_Plants] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Plants_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([Id]) ON DELETE CASCADE
);
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Name') AND [object_id] = OBJECT_ID(N'[Categories]'))
    SET IDENTITY_INSERT [Categories] ON;
INSERT INTO [Categories] ([Id], [Name])
VALUES (1, N'Air Purifying'),
(2, N'Low Light'),
(3, N'Pet Friendly');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Name') AND [object_id] = OBJECT_ID(N'[Categories]'))
    SET IDENTITY_INSERT [Categories] OFF;
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CategoryId', N'Description', N'Difficulty', N'ImageUrl', N'IsPetFriendly', N'LightRequirement', N'Name', N'Price', N'ScientificName', N'StockQuantity', N'WaterNeeds') AND [object_id] = OBJECT_ID(N'[Plants]'))
    SET IDENTITY_INSERT [Plants] ON;
INSERT INTO [Plants] ([Id], [CategoryId], [Description], [Difficulty], [ImageUrl], [IsPetFriendly], [LightRequirement], [Name], [Price], [ScientificName], [StockQuantity], [WaterNeeds])
VALUES (1, 1, N'A hardy plant that thrives in low light.', 0, N'https://placeholder.com/snakeplant.jpg', CAST(0 AS bit), 0, N'Snake Plant', 15.99, N'Sansevieria trifasciata', 50, 0),
(2, 3, N'Easy to grow and produces babies.', 0, N'https://placeholder.com/spiderplant.jpg', CAST(1 AS bit), 1, N'Spider Plant', 12.5, N'Chlorophytum comosum', 30, 1);
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CategoryId', N'Description', N'Difficulty', N'ImageUrl', N'IsPetFriendly', N'LightRequirement', N'Name', N'Price', N'ScientificName', N'StockQuantity', N'WaterNeeds') AND [object_id] = OBJECT_ID(N'[Plants]'))
    SET IDENTITY_INSERT [Plants] OFF;
GO

CREATE INDEX [IX_Plants_CategoryId] ON [Plants] ([CategoryId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251203063312_InitialCreate', N'8.0.2');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [AspNetRoles] (
    [Id] nvarchar(450) NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AspNetUsers] (
    [Id] nvarchar(450) NOT NULL,
    [UserName] nvarchar(256) NULL,
    [NormalizedUserName] nvarchar(256) NULL,
    [Email] nvarchar(256) NULL,
    [NormalizedEmail] nvarchar(256) NULL,
    [EmailConfirmed] bit NOT NULL,
    [PasswordHash] nvarchar(max) NULL,
    [SecurityStamp] nvarchar(max) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [PhoneNumber] nvarchar(max) NULL,
    [PhoneNumberConfirmed] bit NOT NULL,
    [TwoFactorEnabled] bit NOT NULL,
    [LockoutEnd] datetimeoffset NULL,
    [LockoutEnabled] bit NOT NULL,
    [AccessFailedCount] int NOT NULL,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY,
    [RoleId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY,
    [UserId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUserRoles] (
    [UserId] nvarchar(450) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUserTokens] (
    [UserId] nvarchar(450) NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
GO

CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;
GO

CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
GO

CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
GO

CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
GO

CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
GO

CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251203065250_AddIdentity', N'8.0.2');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [AspNetUsers] ADD [FullName] nvarchar(max) NOT NULL DEFAULT N'';
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251203074052_AddFullNameToUser', N'8.0.2');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

UPDATE [Plants] SET [ImageUrl] = N'/SnakePlant.png'
WHERE [Id] = 1;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [ImageUrl] = N'/SpiderPlant.png'
WHERE [Id] = 2;
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251204060941_UpdatePlantImages', N'8.0.2');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

UPDATE [Plants] SET [Price] = 499.0
WHERE [Id] = 1;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [Price] = 399.0
WHERE [Id] = 2;
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251204061241_UpdatePlantPrices', N'8.0.2');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Name') AND [object_id] = OBJECT_ID(N'[Categories]'))
    SET IDENTITY_INSERT [Categories] ON;
INSERT INTO [Categories] ([Id], [Name])
VALUES (4, N'Succulents'),
(5, N'Flowering');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Name') AND [object_id] = OBJECT_ID(N'[Categories]'))
    SET IDENTITY_INSERT [Categories] OFF;
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CategoryId', N'Description', N'Difficulty', N'ImageUrl', N'IsPetFriendly', N'LightRequirement', N'Name', N'Price', N'ScientificName', N'StockQuantity', N'WaterNeeds') AND [object_id] = OBJECT_ID(N'[Plants]'))
    SET IDENTITY_INSERT [Plants] ON;
INSERT INTO [Plants] ([Id], [CategoryId], [Description], [Difficulty], [ImageUrl], [IsPetFriendly], [LightRequirement], [Name], [Price], [ScientificName], [StockQuantity], [WaterNeeds])
VALUES (3, 1, N'Famous for its natural leaf holes.', 0, N'/Monstera.png', CAST(0 AS bit), 1, N'Monstera Deliciosa', 1299.0, N'Monstera deliciosa', 20, 1),
(4, 1, N'Popular indoor tree with large leaves.', 2, N'/FiddleLeaf.png', CAST(0 AS bit), 2, N'Fiddle Leaf Fig', 2499.0, N'Ficus lyrata', 15, 1),
(6, 1, N'Shiny, dark leaves.', 0, N'/RubberPlant.png', CAST(0 AS bit), 1, N'Rubber Plant', 899.0, N'Ficus elastica', 25, 1),
(8, 2, N'Fast growing trailing vine.', 0, N'/Pothos.png', CAST(0 AS bit), 0, N'Golden Pothos', 349.0, N'Epipremnum aureum', 55, 1),
(9, 2, N'Extremely drought tolerant.', 0, N'/ZZPlant.png', CAST(0 AS bit), 0, N'ZZ Plant', 799.0, N'Zamioculcas zamiifolia', 35, 0),
(11, 1, N'Classic trailing plant.', 1, N'/Pothos.png', CAST(0 AS bit), 1, N'English Ivy', 399.0, N'Hedera helix', 45, 1),
(12, 1, N'Heart-shaped leaves.', 0, N'/Pothos.png', CAST(0 AS bit), 1, N'Heartleaf Philodendron', 449.0, N'Philodendron hederaceum', 40, 1),
(15, 3, N'Pet friendly air purifier.', 0, N'/Monstera.png', CAST(1 AS bit), 0, N'Bamboo Palm', 1499.0, N'Chamaedorea seifrizii', 15, 2),
(16, 3, N'Round, coin-like leaves.', 1, N'/ZZPlant.png', CAST(1 AS bit), 1, N'Chinese Money Plant', 549.0, N'Pilea peperomioides', 25, 1),
(17, 3, N'Leaves fold up at night.', 2, N'/PeaceLily.png', CAST(1 AS bit), 0, N'Calathea Prayer Plant', 999.0, N'Calathea orbifolia', 18, 2),
(19, 3, N'Lush and feathery.', 1, N'/SpiderPlant.png', CAST(1 AS bit), 1, N'Boston Fern', 599.0, N'Nephrolepis exaltata', 30, 2),
(5, 5, N'Beautiful white flowers and air purifying.', 0, N'/PeaceLily.png', CAST(0 AS bit), 0, N'Peace Lily', 699.0, N'Spathiphyllum', 40, 2),
(7, 4, N'Medicinal succulent.', 0, N'/AloeVera.png', CAST(0 AS bit), 2, N'Aloe Vera', 299.0, N'Aloe barbadensis miller', 60, 0),
(10, 5, N'Tropical flair with large leaves.', 1, N'/Monstera.png', CAST(0 AS bit), 2, N'Bird of Paradise', 1899.0, N'Strelitzia nicolai', 10, 2),
(13, 4, N'Symbol of good luck.', 0, N'/AloeVera.png', CAST(0 AS bit), 2, N'Jade Plant', 599.0, N'Crassula ovata', 30, 0),
(14, 4, N'Unique cascading succulent.', 2, N'/AloeVera.png', CAST(0 AS bit), 1, N'String of Pearls', 649.0, N'Senecio rowleyanus', 20, 0),
(18, 5, N'Aromatic and calming.', 1, N'/PeaceLily.png', CAST(0 AS bit), 2, N'Lavender', 399.0, N'Lavandula', 50, 0),
(20, 4, N'Round and spiky.', 0, N'/AloeVera.png', CAST(0 AS bit), 2, N'Barrel Cactus', 899.0, N'Echinocactus grusonii', 12, 0),
(21, 5, N'Elegant blooming orchid.', 1, N'/PeaceLily.png', CAST(1 AS bit), 1, N'Phalaenopsis Orchid', 1199.0, N'Phalaenopsis', 20, 1),
(22, 4, N'Rosette forming succulent.', 0, N'/AloeVera.png', CAST(1 AS bit), 2, N'Echeveria', 249.0, N'Echeveria elegans', 40, 0);
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CategoryId', N'Description', N'Difficulty', N'ImageUrl', N'IsPetFriendly', N'LightRequirement', N'Name', N'Price', N'ScientificName', N'StockQuantity', N'WaterNeeds') AND [object_id] = OBJECT_ID(N'[Plants]'))
    SET IDENTITY_INSERT [Plants] OFF;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251204063826_UpdatePlantImagesFallback', N'8.0.2');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Orders] (
    [Id] int NOT NULL IDENTITY,
    [UserId] nvarchar(450) NOT NULL,
    [OrderDate] datetime2 NOT NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [Status] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Orders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Orders_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [OrderItems] (
    [Id] int NOT NULL IDENTITY,
    [OrderId] int NOT NULL,
    [PlantId] int NOT NULL,
    [Quantity] int NOT NULL,
    [UnitPrice] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_OrderItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_OrderItems_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_OrderItems_Plants_PlantId] FOREIGN KEY ([PlantId]) REFERENCES [Plants] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_OrderItems_OrderId] ON [OrderItems] ([OrderId]);
GO

CREATE INDEX [IX_OrderItems_PlantId] ON [OrderItems] ([PlantId]);
GO

CREATE INDEX [IX_Orders_UserId] ON [Orders] ([UserId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251204092755_AddOrders', N'8.0.2');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DELETE FROM [Categories]
WHERE [Id] = 2;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Categories]
WHERE [Id] = 3;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [CategoryId] = 1
WHERE [Id] = 2;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [CategoryId] = 1
WHERE [Id] = 8;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [CategoryId] = 1
WHERE [Id] = 9;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [CategoryId] = 1
WHERE [Id] = 15;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [CategoryId] = 1
WHERE [Id] = 16;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [CategoryId] = 1
WHERE [Id] = 17;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [CategoryId] = 1
WHERE [Id] = 19;
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251204130110_RemoveRedundantCategories', N'8.0.2');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Orders] ADD [OrderIdentifier] nvarchar(max) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251204132715_AddOrderIdentifier', N'8.0.2');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Orders] ADD [LastUpdated] datetime2 NULL;
GO

ALTER TABLE [Orders] ADD [Notes] nvarchar(max) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251204134236_AddNotesAndLastUpdated', N'8.0.2');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Plants] ADD [IsDeleted] bit NOT NULL DEFAULT CAST(0 AS bit);
GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 1;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 2;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 3;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 4;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 5;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 6;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 7;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 8;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 9;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 10;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 11;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 12;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 13;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 14;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 15;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 16;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 17;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 18;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 19;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 20;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 21;
SELECT @@ROWCOUNT;

GO

UPDATE [Plants] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 22;
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251204140754_AddSoftDeleteToPlant', N'8.0.2');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DELETE FROM [Plants]
WHERE [Id] = 1;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 2;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 3;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 4;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 5;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 6;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 7;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 8;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 9;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 10;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 11;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 12;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 13;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 14;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 15;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 16;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 17;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 18;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 19;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 20;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 21;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Plants]
WHERE [Id] = 22;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Categories]
WHERE [Id] = 1;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Categories]
WHERE [Id] = 4;
SELECT @@ROWCOUNT;

GO

DELETE FROM [Categories]
WHERE [Id] = 5;
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251204141115_RemoveHardcodedSeeding', N'8.0.2');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Orders] ADD [PhoneNumber] nvarchar(max) NOT NULL DEFAULT N'';
GO

ALTER TABLE [Orders] ADD [ShippingAddress] nvarchar(max) NOT NULL DEFAULT N'';
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251204201129_AddShippingAndPhoneToOrder', N'8.0.2');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251205072925_SyncOrderSchema', N'8.0.2');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [ChatMessages] (
    [Id] int NOT NULL IDENTITY,
    [SenderId] nvarchar(450) NOT NULL,
    [ReceiverId] nvarchar(450) NULL,
    [ConversationUserId] nvarchar(450) NOT NULL,
    [Content] nvarchar(max) NOT NULL,
    [Timestamp] datetime2 NOT NULL,
    [IsRead] bit NOT NULL,
    [IsFromAdmin] bit NOT NULL,
    CONSTRAINT [PK_ChatMessages] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ChatMessages_AspNetUsers_ConversationUserId] FOREIGN KEY ([ConversationUserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_ChatMessages_AspNetUsers_ReceiverId] FOREIGN KEY ([ReceiverId]) REFERENCES [AspNetUsers] ([Id]),
    CONSTRAINT [FK_ChatMessages_AspNetUsers_SenderId] FOREIGN KEY ([SenderId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION
);
GO

CREATE INDEX [IX_ChatMessages_ConversationUserId] ON [ChatMessages] ([ConversationUserId]);
GO

CREATE INDEX [IX_ChatMessages_ReceiverId] ON [ChatMessages] ([ReceiverId]);
GO

CREATE INDEX [IX_ChatMessages_SenderId] ON [ChatMessages] ([SenderId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251205153534_AddChatMessages', N'8.0.2');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [ChatMessages] DROP CONSTRAINT [FK_ChatMessages_AspNetUsers_ConversationUserId];
GO

ALTER TABLE [ChatMessages] DROP CONSTRAINT [FK_ChatMessages_AspNetUsers_SenderId];
GO

ALTER TABLE [ChatMessages] ADD CONSTRAINT [FK_ChatMessages_AspNetUsers_ConversationUserId] FOREIGN KEY ([ConversationUserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION;
GO

ALTER TABLE [ChatMessages] ADD CONSTRAINT [FK_ChatMessages_AspNetUsers_SenderId] FOREIGN KEY ([SenderId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251205160204_FixCascadePaths', N'8.0.2');
GO

COMMIT;
GO

