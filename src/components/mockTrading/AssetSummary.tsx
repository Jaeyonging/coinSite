import React from 'react';
import { MdAccountBalanceWallet, MdRefresh } from 'react-icons/md';
import { formatPrice } from '../../utils/formatters';

interface AssetSummaryProps {
  totalAssets: number;
  balance: number;
  totalInvestment: number;
  totalProfitLoss: number;
  totalReturnPercent: number;
  onDepositClick: () => void;
  onResetClick: () => void;
}

const AssetSummary = ({
  totalAssets,
  balance,
  totalInvestment,
  totalProfitLoss,
  totalReturnPercent,
  onDepositClick,
  onResetClick,
}: AssetSummaryProps) => {
  const profitSign = totalProfitLoss > 0 ? 'positive' : totalProfitLoss < 0 ? 'negative' : 'neutral';
  const percentText =
    isFinite(totalReturnPercent) && !isNaN(totalReturnPercent)
      ? `${totalReturnPercent >= 0 ? '+' : ''}${totalReturnPercent.toFixed(2)}%`
      : '0.00%';

  const formattedAssets = formatPrice(totalAssets);
  const assetFontClass =
    formattedAssets.length > 14
      ? 'text-xl md:text-2xl'
      : formattedAssets.length > 11
      ? 'text-2xl md:text-3xl'
      : 'text-3xl md:text-4xl';

  const summaryChips = [
    {
      label: '보유 현금',
      value: `${formatPrice(balance)}원`,
      helper: '즉시 매수 가능 금액',
      valueClass: 'text-slate-900 dark:text-white',
      helperClass: 'text-slate-500 dark:text-slate-400',
    },
    {
      label: '투자금액',
      value: `${formatPrice(totalInvestment)}원`,
      helper: '진입 중인 자산 총합',
      valueClass: 'text-slate-900 dark:text-white',
      helperClass: 'text-slate-500 dark:text-slate-400',
    },
    {
      label: '수익/손실',
      value: `${totalProfitLoss >= 0 ? '+' : ''}${formatPrice(totalProfitLoss)}원`,
      helper: percentText,
      valueClass:
        profitSign === 'positive'
          ? 'text-emerald-500'
          : profitSign === 'negative'
          ? 'text-rose-500'
          : 'text-slate-900 dark:text-white',
      helperClass:
        profitSign === 'positive'
          ? 'text-emerald-500'
          : profitSign === 'negative'
          ? 'text-rose-500'
          : 'text-slate-500 dark:text-slate-400',
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 text-slate-900 shadow-lg md:p-8 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
              <MdAccountBalanceWallet className="h-5 w-5" />
              총 자산
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div
                className={`inline-flex rounded-2xl bg-white px-4 py-2 font-bold text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white ${assetFontClass}`}
              >
                {formattedAssets}원
              </div>
              <div
                className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold md:text-sm ${
                  profitSign === 'positive'
                    ? 'bg-emerald-50 text-emerald-600'
                    : profitSign === 'negative'
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {totalProfitLoss >= 0 ? '+' : ''}
                {formatPrice(totalProfitLoss)}원 · {percentText}
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500 md:text-sm dark:text-slate-400">실시간 손익 요약</p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <button
              onClick={onDepositClick}
              className="flex items-center justify-center gap-2 rounded-2xl border border-indigo-100 bg-white px-5 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              입금하기
            </button>
            <button
              onClick={onResetClick}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
            >
              <MdRefresh size={16} />
              초기화
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {summaryChips.map((chip) => (
          <div
            key={chip.label}
            className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {chip.label}
            </div>
            <div className={`mt-2 text-xl font-bold ${chip.valueClass}`}>{chip.value}</div>
            <div className={`mt-1 text-xs ${chip.helperClass}`}>{chip.helper}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetSummary;
