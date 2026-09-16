export const UNREAL_ENGINE_GUIDE = {
  engineVersion: 'Unreal Engine 5.4 / 5.5',
  projectType: 'Simulador Ferroviário e Urbano de Acessibilidade (C++ & Blueprints)',
  architecture: {
    coreSystems: [
      {
        module: 'ATrainLocomotive (C++ / Chaos)',
        description: 'Herdeiro de APawn com simulação de física de tração contínua ao longo de USplineComponent, integrando massa de 78 toneladas, inércia angular dos eixos e cálculo de aderência roda-trilho.'
      },
      {
        module: 'UTrackSplineComponent',
        description: 'Gerador procedural de via permanente ferroviária e metroviária (dormentes, trilhos TR-37/TR-45, brita de lastro e rede aérea/terceiro trilho) com sinalização luminosa e balizas CBTC.'
      },
      {
        module: 'UAccessibilitySubsystem',
        description: 'Gerencia as métricas de conforto dos passageiros (solavancos/Jolt em m/s³), auditoria de alinhamento com a plataforma e acionamento automático de rampas mecânicas (gap fillers) ao parar.'
      },
      {
        module: 'UNPCDialogComponent',
        description: 'Sistema de conversação ramificado com Dona Helena, Tiago (PCD), Beatriz e Mestre Rodolfo, sincronizado com animações faciais MetaHuman e missões de transporte urbano.'
      }
    ],
    renderPipeline: {
      desktop: 'Lumen Global Illumination & Reflections com Nanite em alta densidade, sombras virtuais (VSM) e suporte a NVIDIA DLSS 3.5 / AMD FSR 3.0.',
      mobile: 'Mobile Forward Shading com Vulkan (Android) e Metal (iOS), mapas de luz pré-calculados (Baked Lightmaps) e texturas ASTC 6x6 compactadas.'
    }
  },
  multiplatformDeploy: {
    pc: {
      target: 'Windows 64-bit / Steam / Epic Games Store',
      buildConfig: 'Shipping com crash reporter customizado',
      minSpecs: 'CPU 6-Core, 16 GB RAM, GPU GTX 1060 / RX 580 ou superior',
      recommendedSpecs: 'CPU 8-Core, 32 GB RAM, RTX 3070 / RX 6700 XT com SSD NVMe'
    },
    mobile: {
      target: 'Google Play Store (Android AAB / APK) & Apple App Store (iOS IPA)',
      optimization: 'LOD dinâmico de 4 níveis para a locomotiva (LOD0: 120k tris até LOD3: 4k tris), occlusion culling e UI com suporte a toque multi-touch (Virtual Joysticks e botões hápticos)'
    },
    web: {
      target: 'Web Edition (Navegadores Modernos WebGL / WebGPU & PWA)',
      features: 'Acesso instantâneo sem instalação prévia, controles responsivos para mobile e teclado de PC, som Web Audio harmônico e integração com materiais de divulgação.'
    }
  },
  cppSampleCode: `// Copyright (c) 2026 Joinville nos Trilhos. All Rights Reserved.
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Pawn.h"
#include "Components/SplineComponent.h"
#include "TrainLocomotive.generated.h"

UCLASS()
class ATrainLocomotive : public APawn
{
    GENERATED_BODY()

public:
    ATrainLocomotive();

    // Parametros da locomotiva
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Ferrovia|Fisica")
    float BoilerPressureBar = 14.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Ferrovia|Fisica")
    float RegulatorPercent = 0.0f; // 0 - 100%

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Ferrovia|Fisica")
    float TrainBrakePressureBar = 5.0f; // Westinghouse 5.0 bar

    UPROPERTY(BlueprintReadOnly, Category = "Ferrovia|Telemetria")
    float CurrentSpeedKmh = 0.0f;

    UPROPERTY(BlueprintReadOnly, Category = "Ferrovia|Acessibilidade")
    float PlatformAlignmentDistanceMeters = 0.0f;

    UFUNCTION(BlueprintCallable, Category = "Ferrovia|Controle")
    void ApplyThrottle(float Value);

    UFUNCTION(BlueprintCallable, Category = "Ferrovia|Controle")
    void ApplyBrake(float Value);

    UFUNCTION(BlueprintCallable, Category = "Ferrovia|Sons")
    void BlowSteamWhistle();

protected:
    virtual void Tick(float DeltaTime) override;
    virtual void BeginPlay() override;

private:
    float CalculateTractiveEffort();
    void EvaluateAccessibilityComfort(float AccelerationDelta);
};`
};
