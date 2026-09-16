export const FREECAD_PYTHON_SCRIPT = `# -*- coding: utf-8 -*-
"""
================================================================================
PROJETO: LOCOMOTIVA A VAPOR E VLT REGIONAL DE JOINVILLE - SC
MODELO PARAMETRICO 3D PARA FREECAD (v0.20 / v0.21 / v1.0)
Autor: Engenharia Ferroviaria Joinville nos Trilhos
================================================================================
Como executar no FreeCAD:
1. Abra o FreeCAD (versao 0.20 ou superior).
2. Va no menu: Macro -> Macros... -> Criar Novo -> nomeie 'Locomotiva_Joinville.py'.
3. Cole este codigo e clique em 'Executar' (Ctrl+F6 ou botao verde Play).
4. O modelo 3D solido completo sera gerado na arvore com corpos e dimensoes reais!
================================================================================
"""

import FreeCAD
import Part
import math

doc = FreeCAD.newDocument("Locomotiva_Joinville_Acessivel")

# ==========================================
# 1. PARAMETROS DIMENSIONAIS DE ENGENHARIA (mm)
# ==========================================
BITOLA = 1000.0                # Bitola Metrica (1.000 mm - EFSC Joinville)
DIAM_RODA_MOTRIZ = 1450.0      # Diametro das rodas motrizes com friso
LARGURA_RODA = 135.0           # Largura do pneu de rolamento
DIAM_EIXO = 210.0              # Eixo de aco forjado
NUM_EIXOS_MOTRIZES = 3         # Disposicao 2-6-2
ENTRE_EIXOS = 1650.0           # Distancia entre eixos motrizes

COMPRIMENTO_CHASSI = 11400.0   # Comprimento total do vigamento
LARGURA_CHASSI = 1200.0        # Largura interna entre longarinas
ALTURA_CHASSI = 450.0          # Altura da longarina
ESPESSURA_CHASSI = 35.0        # Espessura da chapa estrutural

DIAM_CALDEIRA = 1720.0         # Diametro externo da caldeira cilindrica
COMPRIMENTO_CALDEIRA = 6200.0  # Comprimento da caldeira
ALTURA_EIXO_CALDEIRA = 2300.0  # Centro da caldeira em relacao ao topo do trilho

LARGURA_CABINE = 2800.0        # Largura da cabine do maquinista
COMPRIMENTO_CABINE = 2300.0    # Comprimento da cabine
ALTURA_CABINE = 2650.0         # Altura da cabine

DIAM_CHAMINE = 480.0           # Diametro da chaminé
ALTURA_CHAMINE = 950.0         # Altura da chaminé acima da caixa de fumaça

# ==========================================
# 2. CONSTRUCAO DO CHASSI E LONGARINAS
# ==========================================
print("[1/6] Modelando Chassi Estrutural de Joinville...")
chassi_dir = Part.makeBox(COMPRIMENTO_CHASSI, ESPESSURA_CHASSI, ALTURA_CHASSI)
chassi_dir.translate(FreeCAD.Vector(-COMPRIMENTO_CHASSI/2, LARGURA_CHASSI/2, DIAM_RODA_MOTRIZ/2 - 100))

chassi_esq = Part.makeBox(COMPRIMENTO_CHASSI, ESPESSURA_CHASSI, ALTURA_CHASSI)
chassi_esq.translate(FreeCAD.Vector(-COMPRIMENTO_CHASSI/2, -LARGURA_CHASSI/2 - ESPESSURA_CHASSI, DIAM_RODA_MOTRIZ/2 - 100))

# Travessoes estruturais
travessoes = []
for i in range(-3, 4):
    trav = Part.makeBox(ESPESSURA_CHASSI*2, LARGURA_CHASSI, ALTURA_CHASSI - 60)
    trav.translate(FreeCAD.Vector(i * 1200.0, -LARGURA_CHASSI/2, DIAM_RODA_MOTRIZ/2 - 70))
    travessoes.append(trav)

chassi_comp = chassi_dir.fuse(chassi_esq)
for t in travessoes:
    chassi_comp = chassi_comp.fuse(t)

# ==========================================
# 3. RODEIROS MOTRIZES E EIXOS (3 PARES)
# ==========================================
print("[2/6] Modelando Rodeiros Motrizes e Pneus com Friso...")
rodeiros_comp = None

for i in range(NUM_EIXOS_MOTRIZES):
    posX = (i - 1) * ENTRE_EIXOS
    posZ = DIAM_RODA_MOTRIZ / 2.0
    
    # Eixo macico
    eixo = Part.makeCylinder(DIAM_EIXO / 2.0, BITOLA + 300.0)
    eixo.rotate(FreeCAD.Vector(0,0,0), FreeCAD.Vector(1,0,0), 90)
    eixo.translate(FreeCAD.Vector(posX, (BITOLA + 300.0)/2.0, posZ))
    
    # Roda Direita
    corpo_roda_d = Part.makeCylinder(DIAM_RODA_MOTRIZ / 2.0, LARGURA_RODA)
    friso_d = Part.makeCylinder((DIAM_RODA_MOTRIZ / 2.0) + 35.0, 25.0)
    roda_d = corpo_roda_d.fuse(friso_d)
    roda_d.rotate(FreeCAD.Vector(0,0,0), FreeCAD.Vector(1,0,0), 90)
    roda_d.translate(FreeCAD.Vector(posX, BITOLA/2.0 + LARGURA_RODA, posZ))
    
    # Roda Esquerda
    corpo_roda_e = Part.makeCylinder(DIAM_RODA_MOTRIZ / 2.0, LARGURA_RODA)
    friso_e = Part.makeCylinder((DIAM_RODA_MOTRIZ / 2.0) + 35.0, 25.0)
    roda_e = corpo_roda_e.fuse(friso_e)
    roda_e.rotate(FreeCAD.Vector(0,0,0), FreeCAD.Vector(1,0,0), 90)
    roda_e.translate(FreeCAD.Vector(posX, -BITOLA/2.0, posZ))
    
    conjunto_eixo = eixo.fuse(roda_d).fuse(roda_e)
    if rodeiros_comp is None:
        rodeiros_comp = conjunto_eixo
    else:
        rodeiros_comp = rodeiros_comp.fuse(conjunto_eixo)

# ==========================================
# 4. CALDEIRA, FORNALHA E CAIXA DE FUMACA
# ==========================================
print("[3/6] Modelando Caldeira de Alta Pressao e Superaquecedor...")
caldeira_cilindro = Part.makeCylinder(DIAM_CALDEIRA / 2.0, COMPRIMENTO_CALDEIRA)
caldeira_cilindro.rotate(FreeCAD.Vector(0,0,0), FreeCAD.Vector(0,1,0), 90)
caldeira_cilindro.translate(FreeCAD.Vector(-COMPRIMENTO_CALDEIRA/2 + 300, 0, ALTURA_EIXO_CALDEIRA))

# Domo de vapor superior
domo_vapor = Part.makeCylinder(380.0, 600.0)
domo_vapor.translate(FreeCAD.Vector(200.0, 0, ALTURA_EIXO_CALDEIRA + DIAM_CALDEIRA/2.0 - 50))

# Caixa de areia
domo_areia = Part.makeCylinder(320.0, 480.0)
domo_areia.translate(FreeCAD.Vector(-1400.0, 0, ALTURA_EIXO_CALDEIRA + DIAM_CALDEIRA/2.0 - 50))

# Caixa de fumaca frontal (Smokebox)
caixa_fumaca = Part.makeCylinder((DIAM_CALDEIRA + 40.0) / 2.0, 1600.0)
caixa_fumaca.rotate(FreeCAD.Vector(0,0,0), FreeCAD.Vector(0,1,0), 90)
caixa_fumaca.translate(FreeCAD.Vector(COMPRIMENTO_CALDEIRA/2 - 1300.0, 0, ALTURA_EIXO_CALDEIRA))

# Chamine
chamine = Part.makeCone(DIAM_CHAMINE/2.0, (DIAM_CHAMINE/2.0) - 40.0, ALTURA_CHAMINE)
chamine.translate(FreeCAD.Vector(COMPRIMENTO_CALDEIRA/2 - 500.0, 0, ALTURA_EIXO_CALDEIRA + DIAM_CALDEIRA/2.0))

# Fornalha retangular traseira
fornalha = Part.makeBox(2200.0, 1600.0, 1800.0)
fornalha.translate(FreeCAD.Vector(-COMPRIMENTO_CALDEIRA/2 - 1200.0, -800.0, ALTURA_EIXO_CALDEIRA - 900.0))

corpo_vapor = caldeira_cilindro.fuse(caixa_fumaca).fuse(domo_vapor).fuse(domo_areia).fuse(chamine).fuse(fornalha)

# ==========================================
# 5. CILINDROS DE VAPOR E BIELAS MOTRIZES
# ==========================================
print("[4/6] Modelando Cilindros e Bielas Walschaerts...")
cil_dir = Part.makeCylinder(280.0, 1100.0)
cil_dir.rotate(FreeCAD.Vector(0,0,0), FreeCAD.Vector(0,1,0), 90)
cil_dir.translate(FreeCAD.Vector(1800.0, 750.0, DIAM_RODA_MOTRIZ/2.0))

cil_esq = Part.makeCylinder(280.0, 1100.0)
cil_esq.rotate(FreeCAD.Vector(0,0,0), FreeCAD.Vector(0,1,0), 90)
cil_esq.translate(FreeCAD.Vector(1800.0, -750.0 - 280.0*2, DIAM_RODA_MOTRIZ/2.0))

biela_dir = Part.makeBox(2400.0, 45.0, 110.0)
biela_dir.translate(FreeCAD.Vector(-300.0, 820.0, DIAM_RODA_MOTRIZ/2.0 - 55.0))

biela_esq = Part.makeBox(2400.0, 45.0, 110.0)
biela_esq.translate(FreeCAD.Vector(-300.0, -820.0 - 45.0, DIAM_RODA_MOTRIZ/2.0 - 55.0))

mecanica_tracao = cil_dir.fuse(cil_esq).fuse(biela_dir).fuse(biela_esq)

# ==========================================
# 6. CABINE DO MAQUINISTA
# ==========================================
print("[5/6] Modelando Cabine de Comando...")
cabine_bruta = Part.makeBox(COMPRIMENTO_CABINE, LARGURA_CABINE, ALTURA_CABINE)
cabine_bruta.translate(FreeCAD.Vector(-COMPRIMENTO_CALDEIRA/2 - 1500.0, -LARGURA_CABINE/2.0, ALTURA_EIXO_CALDEIRA - 800.0))

# Janelas
janela_d = Part.makeBox(900.0, 200.0, 700.0)
janela_d.translate(FreeCAD.Vector(-COMPRIMENTO_CALDEIRA/2 - 900.0, LARGURA_CABINE/2.0 - 100.0, ALTURA_EIXO_CALDEIRA + 400.0))

janela_e = Part.makeBox(900.0, 200.0, 700.0)
janela_e.translate(FreeCAD.Vector(-COMPRIMENTO_CALDEIRA/2 - 900.0, -LARGURA_CABINE/2.0 - 100.0, ALTURA_EIXO_CALDEIRA + 400.0))

cabine = cabine_bruta.cut(janela_d).cut(janela_e)

# Farol de milha frontal (Headlight)
farol = Part.makeCylinder(190.0, 280.0)
farol.rotate(FreeCAD.Vector(0,0,0), FreeCAD.Vector(0,1,0), 90)
farol.translate(FreeCAD.Vector(COMPRIMENTO_CALDEIRA/2 + 350.0, 0, ALTURA_EIXO_CALDEIRA + 200.0))

# Limpa trilhos (Cowcatcher)
limpa_trilhos = Part.makeCone(650.0, 100.0, 800.0)
limpa_trilhos.rotate(FreeCAD.Vector(0,0,0), FreeCAD.Vector(0,1,0), -90)
limpa_trilhos.translate(FreeCAD.Vector(COMPRIMENTO_CHASSI/2.0 - 200.0, 0, DIAM_RODA_MOTRIZ/4.0))

# ==========================================
# 7. EXPORTACAO E CORES NO FREECAD
# ==========================================
print("[6/6] Finalizando Montagem e atribuindo materiais...")
obj_caldeira = doc.addObject("Part::Feature", "Caldeira_Fornalha")
obj_caldeira.Shape = corpo_vapor.fuse(farol)
obj_caldeira.ViewObject.ShapeColor = (0.15, 0.20, 0.25) # Grafite Escuro Metalico

obj_chassi = doc.addObject("Part::Feature", "Chassi_Estrutural")
obj_chassi.Shape = chassi_comp.fuse(limpa_trilhos)
obj_chassi.ViewObject.ShapeColor = (0.75, 0.15, 0.15)  # Vermelho Ferroviario Oxido

obj_rodeiros = doc.addObject("Part::Feature", "Rodeiros_Motrizes")
obj_rodeiros.Shape = rodeiros_comp
obj_rodeiros.ViewObject.ShapeColor = (0.25, 0.25, 0.28) # Aco Forjado Usinado

obj_tracao = doc.addObject("Part::Feature", "Bielas_Cilindros_Walschaerts")
obj_tracao.Shape = mecanica_tracao
obj_tracao.ViewObject.ShapeColor = (0.85, 0.70, 0.20)  # Latao e Aco Polido

obj_cabine = doc.addObject("Part::Feature", "Cabine_Comando")
obj_cabine.Shape = cabine
obj_cabine.ViewObject.ShapeColor = (0.10, 0.35, 0.25)  # Verde Floresta Tradicional

doc.recompute()
FreeCAD.Gui.ActiveDocument.ActiveView.fitAll()
print("==========================================================")
print(" SUCESSO! Locomotiva parametrica gerada no FreeCAD.")
print(" Arquitetura pronta para geracao de desenhos no TechDraw!")
print("==========================================================")
`;
