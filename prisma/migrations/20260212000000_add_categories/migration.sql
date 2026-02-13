-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- AlterTable
ALTER TABLE "Post" ADD COLUMN "categoryId" INTEGER;

-- CreateIndex
CREATE INDEX "Post_categoryId_idx" ON "Post"("categoryId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Inserir categorias iniciais (slug único)
INSERT INTO "Category" ("name", "slug", "description") VALUES
  ('SEO', 'seo', 'Conteúdo sobre otimização para mecanismos de busca e tráfego orgânico'),
  ('Programação', 'programacao', 'Desenvolvimento, código e tecnologia'),
  ('Marketing Digital', 'marketing-digital', 'Estratégias de marketing e vendas online'),
  ('Empreendedorismo', 'empreendedorismo', 'Negócios, produtividade e empreendedorismo'),
  ('Geral', 'geral', 'Artigos gerais do blog')
;

-- Atribuir posts existentes à categoria Geral
UPDATE "Post" SET "categoryId" = (SELECT "id" FROM "Category" WHERE "slug" = 'geral' LIMIT 1) WHERE "categoryId" IS NULL;
