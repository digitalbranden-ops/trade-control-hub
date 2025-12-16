# Referência da Estratégia - EMA Escadinha + Linha Magnética

Este documento descreve os parâmetros exatos da estratégia Pine Script para verificação no bot Python.

---

## 📊 INDICADOR - Modelo C

### EMA Escadinha
| Parâmetro | Valor | Descrição |
|-----------|-------|-----------|
| `emaLen` | **9** | Período da EMA |
| `smoothLen` | **46** | Suavização da EMA |
| `tfEma` | **"5"** | Timeframe da EMA (5 minutos) |

### Desvio Padrão / Linha Magnética
| Parâmetro | Valor | Descrição |
|-----------|-------|-----------|
| `stdevLen` | **2** | Período do desvio padrão |
| `stdevMult` | **1.0** | Multiplicador do desvio |
| `tfStdev` | **"15"** | Timeframe do desvio (15 minutos) |
| `repulsionMult` | **10.0** | Intensidade do campo magnético |

---

## 📈 SINAIS DE ENTRADA

| Sinal | Condição |
|-------|----------|
| **LONG** | `EMA Escadinha` cruza **ACIMA** da `Linha Magnética` |
| **SHORT** | `EMA Escadinha` cruza **ABAIXO** da `Linha Magnética` |

### Código Pine Script:
```pinescript
sigLong  = ta.crossover(emaSmooth, invLine)
sigShort = ta.crossunder(emaSmooth, invLine)
```

---

## 🎯 TAKE PROFITS (4 níveis)

| TP | % do Preço | % da Posição |
|----|------------|--------------|
| **TP1** | 1.1% | 25% |
| **TP2** | 2.3% | 45% |
| **TP3** | 4.5% | 20% |
| **TP4** | 7.5% | 10% |

### Cálculo para LONG:
```
TP1 = entryPrice * (1 + 0.011)
TP2 = entryPrice * (1 + 0.023)
TP3 = entryPrice * (1 + 0.045)
TP4 = entryPrice * (1 + 0.075)
```

### Cálculo para SHORT:
```
TP1 = entryPrice * (1 - 0.011)
TP2 = entryPrice * (1 - 0.023)
TP3 = entryPrice * (1 - 0.045)
TP4 = entryPrice * (1 - 0.075)
```

---

## 🛑 STOP LOSS

| Parâmetro | Valor |
|-----------|-------|
| `stopLossPerc` | **1.4%** |

### Cálculo:
```
LONG:  stopPrice = entryPrice * (1 - 0.014)
SHORT: stopPrice = entryPrice * (1 + 0.014)
```

---

## 📉 TRAILING STOP

| Parâmetro | Valor |
|-----------|-------|
| `trailStopPerc` | **3.0%** |
| `trailStartTP` | **2** (ativa após TP2) |

### Comportamento:
1. **Inativo** até atingir TP2
2. Após TP2, começa a rastrear o preço máximo (LONG) ou mínimo (SHORT)
3. O stop segue o preço a uma distância de 3%

### Cálculo:
```
LONG:  trailStopPrice = maxPrice * (1 - 0.03)
SHORT: trailStopPrice = minPrice * (1 + 0.03)
```

---

## 🔄 REVERSÃO

A estratégia **REVERTE** a posição quando aparece sinal oposto:

- Se está **LONG** e aparece sinal **SHORT**: Fecha LONG e abre SHORT
- Se está **SHORT** e aparece sinal **LONG**: Fecha SHORT e abre LONG

**Nota:** Esta versão NÃO usa a regra de 3 candles (confirmação removida).

---

## ⚙️ CONFIG.JSON para o Bot Python

Use estes valores no seu `config.json`:

```json
{
  "strategy": {
    "name": "EMA_Escadinha_Magnetico",
    "ema_period": 9,
    "ema_smoothing": 46,
    "ema_timeframe": "5m",
    "stdev_period": 2,
    "stdev_multiplier": 1.0,
    "stdev_timeframe": "15m",
    "magnetic_intensity": 10.0
  },
  "take_profits": {
    "tp1": { "percent": 1.1, "position_percent": 25 },
    "tp2": { "percent": 2.3, "position_percent": 45 },
    "tp3": { "percent": 4.5, "position_percent": 20 },
    "tp4": { "percent": 7.5, "position_percent": 10 }
  },
  "risk": {
    "stop_loss_percent": 1.4,
    "trailing_stop_percent": 3.0,
    "trailing_start_after_tp": 2
  },
  "rules": {
    "allow_reversal": true,
    "use_3_candle_confirmation": false
  }
}
```

---

## 🔍 CHECKLIST DE VERIFICAÇÃO

Verifique se seu bot Python implementa:

- [ ] EMA período 9 com suavização 46 no timeframe 5min
- [ ] Desvio padrão período 2, multiplicador 1.0 no timeframe 15min
- [ ] Campo magnético com intensidade 10.0
- [ ] Sinal LONG = crossover (EMA cruza acima da linha magnética)
- [ ] Sinal SHORT = crossunder (EMA cruza abaixo da linha magnética)
- [ ] TP1: 1.1% do preço, fecha 25% da posição
- [ ] TP2: 2.3% do preço, fecha 45% da posição
- [ ] TP3: 4.5% do preço, fecha 20% da posição
- [ ] TP4: 7.5% do preço, fecha 100% restante
- [ ] Stop Loss: 1.4%
- [ ] Trailing Stop: 3.0%, ativa após TP2
- [ ] Reversão automática em sinal oposto
- [ ] SEM regra de 3 candles de confirmação

---

## 📝 FÓRMULAS COMPLETAS

### Linha Magnética (invLine):
```
// Direção
isUp = emaSmooth > emaSmooth[1]

// Desvio invertido
invStdev = (isUp ? -stdev : stdev) * stdevMult

// Linha bruta
invLineRaw = emaSmooth + invStdev

// Força magnética
slope = emaSmooth - emaSmooth[1]
forceMag = abs(slope) * repulsionMult

// Linha final
invLine = isUp ? (invLineRaw - forceMag) : (invLineRaw + forceMag)
```

### Cor da EMA:
```
Verde (lime): quando EMA subindo (isUp = true)
Laranja: quando EMA descendo (isUp = false)
```

---

**Última atualização:** Dezembro 2024
**Versão Pine Script:** v6
