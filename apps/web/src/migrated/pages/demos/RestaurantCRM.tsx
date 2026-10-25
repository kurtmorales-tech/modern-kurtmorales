/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { CheckCircle2, Users, Calendar, Utensils, ArrowRight, PieChart } from "lucide-react";
import { useState, useEffect } from "react";

export default function RestaurantCRM() {
  const [reservations, setReservations] = useState([
    { id: 1, name: "John Doe", time: "19:00", guests: 4, status: "Confirmed" },
    { id: 2, name: "Jane Smith", time: "20:30", guests: 2, status: "Pending" }
  ]);

  useEffect(() => {
    document.title = "Restaurant CRM SaaS Demo | Kurt's Portfolio";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Live demo of the Restaurant CRM System. Full SaaS system for restaurant management, reservation tracking, and automation.");
    }
  }, []);

  const addReservation = () => {
    setReservations(prev => [...prev, { id: Date.now(), name: "New Guest", time: "21:00", guests: 2, status: "Confirmed" }]);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest">
            <CheckCircle2 className="w-3 h-3" />
            SaaS Platform
          </div>
          <h1 className="text-5xl font-black tracking-tight">Restaurant CRM System</h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Full SaaS system for restaurant management, reservation tracking, and automation. 
            Streamline your operations and delight your guests.
          </p>
        </div>

        {/* CRM Interface */}
        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Reservation Manager</h3>
            <button 
              onClick={addReservation}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-xl font-bold transition-all text-sm"
            >
              Add Reservation
            </button>
          </div>

          <div className="space-y-4">
            {reservations.map((r) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={r.id}
                className="p-6 rounded-2xl bg-black border border-white/5 flex items-center justify-between group hover:border-orange-500/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold">{r.name}</div>
                    <div className="text-xs text-gray-500">{r.guests} Guests • {r.time}</div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${r.status === 'Confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                  {r.status}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Calendar className="w-5 h-5" />, title: "Smart Scheduling", desc: "Automated table allocation and waitlist management." },
            { icon: <Utensils className="w-5 h-5" />, title: "Menu Optimization", desc: "Analytics-driven menu engineering to boost profits." },
            { icon: <PieChart className="w-5 h-5" />, title: "Revenue Insights", desc: "Real-time reporting on peak hours and guest spending." }
          ].map((f, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 space-y-4">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500 w-fit">{f.icon}</div>
              <h4 className="font-bold">{f.title}</h4>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
