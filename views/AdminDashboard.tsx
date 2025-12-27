
import React from 'react';
import { Card } from '../components/UI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, ShoppingBag, BookOpen, TrendingUp, DollarSign } from 'lucide-react';

const data = [
  { name: 'Mon', sales: 4000, users: 2400 },
  { name: 'Tue', sales: 3000, users: 1398 },
  { name: 'Wed', sales: 2000, users: 9800 },
  { name: 'Thu', sales: 2780, users: 3908 },
  { name: 'Fri', sales: 1890, users: 4800 },
  { name: 'Sat', sales: 2390, users: 3800 },
  { name: 'Sun', sales: 3490, users: 4300 },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Business Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Active Users', val: '2,840', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Weekly Sales', val: '$14,200', icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Verified Sources', val: '154', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Conv. Rate', val: '4.2%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' }
        ].map((stat, i) => (
          <Card key={i} className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.val}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-lg">Sales & Conversion</h3>
             <div className="text-sm font-medium text-slate-500">Last 7 Days</div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-lg mb-6">Top Recommended</h3>
          <div className="space-y-4">
            {[
              { name: 'Creatine Monohydrate', hits: 1240, price: '$24.99' },
              { name: 'Whey Isolate (Grass Fed)', hits: 890, price: '$49.99' },
              { name: 'Vitamin D3 + K2', hits: 750, price: '$18.99' },
              { name: 'Magnesium Glycinate', hits: 560, price: '$21.99' }
            ].map((prod, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-800">{prod.name}</div>
                  <div className="text-xs text-slate-500">{prod.hits} recommendations</div>
                </div>
                <div className="text-indigo-600 font-bold">{prod.price}</div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-sm font-bold text-indigo-600 hover:text-indigo-700">VIEW FULL CATALOG →</button>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
