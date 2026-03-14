import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ComparisonTable() {
  const { t, i18n } = useTranslation();

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-hdb-green uppercase tracking-[0.2em] mb-4">
            {i18n.language === 'vi' ? 'So sánh hiệu quả' : 'Efficiency Comparison'}
          </h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold text-hdb-dark mb-6">
            {i18n.language === 'vi' ? 'Tại sao chọn Biomass?' : 'Why Choose Biomass?'}
          </h3>
          <p className="text-hdb-dark/60 text-lg">
            {i18n.language === 'vi' 
              ? 'So sánh trực tiếp giữa nhiên liệu sinh khối và các loại nhiên liệu truyền thống.' 
              : 'Direct comparison between biomass fuel and traditional fuels.'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-hdb-earth">
                <th className="py-6 px-4 text-left text-hdb-dark/40 font-bold uppercase tracking-widest text-xs">{i18n.language === 'vi' ? 'Chỉ số' : 'Metric'}</th>
                <th className="py-6 px-4 text-center bg-hdb-green/5 text-hdb-green font-bold uppercase tracking-widest text-xs">Biomass (EcoLoop™)</th>
                <th className="py-6 px-4 text-center text-hdb-dark/40 font-bold uppercase tracking-widest text-xs">{i18n.language === 'vi' ? 'Than đá' : 'Coal'}</th>
                <th className="py-6 px-4 text-center text-hdb-dark/40 font-bold uppercase tracking-widest text-xs">DO / FO Oil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hdb-earth/30">
              {[
                { 
                  label: i18n.language === 'vi' ? 'Chi phí năng lượng' : 'Energy Cost', 
                  biomass: i18n.language === 'vi' ? 'Thấp nhất' : 'Lowest', 
                  coal: i18n.language === 'vi' ? 'Trung bình' : 'Medium', 
                  oil: i18n.language === 'vi' ? 'Rất cao' : 'Very High' 
                },
                { 
                  label: i18n.language === 'vi' ? 'Phát thải CO2' : 'CO2 Emissions', 
                  biomass: i18n.language === 'vi' ? 'Trung hòa (~0)' : 'Neutral (~0)', 
                  coal: i18n.language === 'vi' ? 'Rất cao' : 'Very High', 
                  oil: i18n.language === 'vi' ? 'Cao' : 'High' 
                },
                { 
                  label: i18n.language === 'vi' ? 'Tro xỉ' : 'Ash Content', 
                  biomass: '< 1-3%', 
                  coal: '15-30%', 
                  oil: 'Negligible' 
                },
                { 
                  label: i18n.language === 'vi' ? 'Tác động lò hơi' : 'Boiler Impact', 
                  biomass: i18n.language === 'vi' ? 'Sạch, ít ăn mòn' : 'Clean, low corrosion', 
                  coal: i18n.language === 'vi' ? 'Ăn mòn cao' : 'High corrosion', 
                  oil: i18n.language === 'vi' ? 'Đóng cặn' : 'Soof build-up' 
                }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-hdb-earth/5 transition-colors">
                  <td className="py-6 px-4 font-bold text-hdb-dark">{row.label}</td>
                  <td className="py-6 px-4 text-center bg-hdb-green/5 font-bold text-hdb-green">{row.biomass}</td>
                  <td className="py-6 px-4 text-center text-hdb-dark/60">{row.coal}</td>
                  <td className="py-6 px-4 text-center text-hdb-dark/60">{row.oil}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
