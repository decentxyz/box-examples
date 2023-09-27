import { Address } from "viem";

interface RiskIndicator {
  category: string
  categoryId: string
  categoryRiskScoreLevel: number
  categoryRiskScoreLevelLabel: string
  incomingVolumeUsd: string
  outgoingVolumeUsd: string
  riskType: string
  totalVolumeUsd: string
}

enum RiskMap {
  "Low" = 1,
  "Medium" = 2,
  "High" = 3
}

function calcRisk(indicators: RiskIndicator[]) {
  let total = 0;
  for (let i = 0; i < indicators.length; i++) {
    let indicator:any = indicators[i];
    total += indicator.categoryRiskScoreLevel * Number(RiskMap[indicator.categoryRiskScoreLevelLabel]);
  }
  const avgRisk = total / indicators.length;

  return avgRisk;
}

export async function submitWallet(chainName: string, walletAddress: Address) {

  const resp = await fetch(
    `https://api.trmlabs.com/public/v2/screening/addresses`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(`${process.env.NEXT_PUBLIC_TRM_API_KEY}:${process.env.NEXT_PUBLIC_TRM_API_KEY}`).toString('base64')
      },
      body: JSON.stringify([{
        chain: chainName,
        address: walletAddress
      }])
    }
  );
  
  const data = await resp.json();
  const riskScore = calcRisk(data[0].addressRiskIndicators);
  
  return riskScore;
};