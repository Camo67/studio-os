'use client';

import React, { useState, useEffect } from 'react';

type ClassItem = {
  id: number;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  tier: number;
  category: string;
  time: string;
};

type UserRole = 'owner' | 'producer' | 'sales' | 'crew' | 'marketing' | 'finance' | null;

const allClasses: ClassItem[] = [
  // Tier 1: Win the Client
  { id: 1, title: 'Make the Call', description: 'Learn how to capture and qualify leads from the first contact.', xp: 100, completed: false, tier: 1, category: 'PIPELINE', time: '3 min' },
  { id: 2, title: 'Send the Proposal', description: 'Create compelling proposals that win clients.', xp: 120, completed: false, tier: 1, category: 'PIPELINE', time: '4 min' },
  { id: 3, title: 'Book It', description: 'Convert proposals into booked deals in the pipeline.', xp: 130, completed: false, tier: 1, category: 'PIPELINE', time: '3 min' },
  { id: 4, title: 'Onboard the Client', description: 'Set expectations and get the project rolling smoothly.', xp: 140, completed: false, tier: 1, category: 'PIPELINE', time: '4 min' },
  { id: 13, title: 'The Media Pass', description: 'Create your networking QR card for events.', xp: 100, completed: false, tier: 1, category: 'GROWTH', time: '3 min' },
  // Tier 2: Run the Project
  { id: 5, title: 'Open the Project', description: 'Initialize projects with all the right details and crew.', xp: 100, completed: false, tier: 2, category: 'PROJECTS', time: '3 min' },
  { id: 14, title: 'Staff It Up', description: 'Add crew, cast, and assign roles to your project.', xp: 150, completed: false, tier: 2, category: 'PROJECTS', time: '5 min' },
  { id: 15, title: 'Shoot Day', description: 'Manage the shoot day workflow and call sheets.', xp: 150, completed: false, tier: 2, category: 'PROJECTS', time: '4 min' },
  { id: 16, title: 'Build and Run Events', description: 'Plan and execute events with run-of-show tools.', xp: 150, completed: false, tier: 2, category: 'PROJECTS', time: '5 min' },
  { id: 17, title: 'Import Footage', description: 'Offload, organize, and prepare media for editing.', xp: 150, completed: false, tier: 2, category: 'PROJECTS', time: '4 min' },
  { id: 6, title: 'Deliver the Work', description: 'Master the media delivery and viewing room workflow.', xp: 150, completed: false, tier: 2, category: 'PROJECTS', time: '4 min' },
  { id: 7, title: 'Review the Cut', description: 'Handle client feedback and version control on edits.', xp: 150, completed: false, tier: 2, category: 'PROJECTS', time: '3 min' },
  // Tier 3: Operate the Business
  { id: 18, title: 'Website Inquiries', description: 'Capture leads from your public website.', xp: 100, completed: false, tier: 3, category: 'GROWTH', time: '3 min' },
  { id: 19, title: 'Marketing Network', description: 'Track referrals and marketing channels.', xp: 120, completed: false, tier: 3, category: 'GROWTH', time: '4 min' },
  { id: 8, title: 'Quote, Invoice, Get Paid', description: 'Complete the billing cycle from quote to payment.', xp: 150, completed: false, tier: 3, category: 'COMMERCE', time: '5 min' },
  { id: 20, title: 'Set Up Payroll', description: 'Track what you owe team and crew.', xp: 120, completed: false, tier: 3, category: 'COMMERCE', time: '4 min' },
  { id: 21, title: 'Set Up the Store', description: 'Configure products, tickets, and point of sale.', xp: 120, completed: false, tier: 3, category: 'COMMERCE', time: '4 min' },
  { id: 9, title: 'Working with Kyra', description: 'Unlock the full power of your AI assistant.', xp: 150, completed: false, tier: 3, category: 'OVERVIEW', time: '5 min' },
  { id: 10, title: 'Context Tags Mastery', description: 'Organize and find anything with smart tagging.', xp: 120, completed: false, tier: 3, category: 'OVERVIEW', time: '4 min' },
  { id: 11, title: 'Set Up Your Team', description: 'Invite crew, set permissions, and configure your studio.', xp: 150, completed: false, tier: 3, category: 'ADMIN', time: '5 min' },
  { id: 12, title: 'Work with a Partner', description: 'Collaborate with contractors and external team members.', xp: 120, completed: false, tier: 3, category: 'OVERVIEW', time: '4 min' },
];

const tierInfo = [
  { tier: 1, name: 'Win the Client', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/50' },
  { tier: 2, name: 'Run the Project', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/50' },
  { tier: 3, name: 'Operate the Business', color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/50' },
];

const roleTracks: Record<string, number[]> = {
  owner: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
  producer: [4, 5, 6, 7, 9, 10, 12, 14, 15, 16, 17],
  sales: [1, 2, 3, 4, 9, 10, 13, 18],
  crew: [5, 6, 9, 10, 14, 15, 17],
  marketing: [2, 9, 10, 13, 18, 19],
  finance: [8, 9, 10, 11, 20, 21],
};

export default function KnowledgeBasePage() {
  const [activeTab, setActiveTab] = useState<'field-guide' | 'academy' | 'training'>('academy');
  const [classes, setClasses] = useState<ClassItem[]>(allClasses);
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('intro');
  const [expandedTiers, setExpandedTiers] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true });
  const [classFilter, setClassFilter] = useState<string>('ALL');

  // Load from localStorage
  useEffect(() => {
    const savedClasses = localStorage.getItem('academy-classes');
    const savedRole = localStorage.getItem('academy-role');
    if (savedClasses) {
      try {
        setClasses(JSON.parse(savedClasses));
      } catch {}
    }
    if (savedRole) {
      setSelectedRole(JSON.parse(savedRole));
    }
  }, []);

  // Save to localStorage when classes change
  useEffect(() => {
    localStorage.setItem('academy-classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    if (selectedRole) {
      localStorage.setItem('academy-role', JSON.stringify(selectedRole));
    }
  }, [selectedRole]);

  const toggleTier = (tier: number) => {
    setExpandedTiers(prev => ({ ...prev, [tier]: !prev[tier] }));
  };

  // Calculate XP and level
  const totalXp = classes.filter(c => c.completed).reduce((sum, c) => sum + c.xp, 0);
  const level = Math.floor(totalXp / 400) + 1;
  const xpInLevel = totalXp % 400;
  const xpToNext = 400 - xpInLevel;
  const completedCount = classes.filter(c => c.completed).length;
  const totalClasses = classes.length;

  // Tier progress
  const tier1Classes = classes.filter(c => c.tier === 1);
  const tier2Classes = classes.filter(c => c.tier === 2);
  const tier3Classes = classes.filter(c => c.tier === 3);
  const tier1Complete = tier1Classes.every(c => c.completed);
  const tier2Complete = tier2Classes.every(c => c.completed);

  const isTierUnlocked = (tier: number) => {
    if (tier === 1) return true;
    if (tier === 2) return tier1Complete;
    if (tier === 3) return tier2Complete;
    return false;
  };

  const isForYou = (classId: number) => {
    if (!selectedRole) return false;
    return roleTracks[selectedRole]?.includes(classId);
  };

  const filteredClasses = classes.filter(c => {
    const matchesSearch = searchQuery === '' || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = classFilter === 'ALL' || c.category === classFilter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['ALL', ...new Set(classes.map(c => c.category))];

  const handleCompleteClass = (classId: number) => {
    setClasses(prev => prev.map(c => 
      c.id === classId ? { ...c, completed: !c.completed } : c
    ));
  };

  const handleResetProgress = () => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      setClasses(prev => prev.map(c => ({ ...c, completed: false })));
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const trainingSections = [
    { id: 'intro', title: '1. What Studio OS Is', icon: '📱' },
    { id: 'concepts', title: '2. Key Concepts to Learn First', icon: '🧠' },
    { id: 'interface', title: '3. The Interface: Every Section Explained', icon: '🖥️' },
    { id: 'public-links', title: '4. What Clients & Crew See', icon: '🔗' },
    { id: 'academy-info', title: '5. Learn with Kyra · The Academy', icon: '🎓' },
    { id: 'knowledge-base-info', title: "6. Your Studio's Knowledge Base", icon: '📚' },
    { id: 'gotchas', title: '7. Things That Trip Up New Users', icon: '⚠️' },
    { id: 'cheat-sheet', title: 'Appendix: Quick Role Cheat Sheet', icon: '📋' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Knowledge base</h1>
          <p className="text-gray-400 text-sm">
            {activeTab === 'academy' 
              ? 'Play through running the studio with Kyra as your coach.'
              : activeTab === 'field-guide'
                ? 'How to use Studio OS - share this with your team.'
                : 'Generated live from your sidebar, Knowledge Base, and academy - never goes stale.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'field-guide' && (
            <>
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark">
                + Add card
              </button>
              <button className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600">
                ✏️ Edit cards
              </button>
            </>
          )}
          {activeTab === 'training' && (
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark">
              🖨️ Print / Save as PDF
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab('field-guide')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'field-guide' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          📘 Field Guide
        </button>
        <button
          onClick={() => setActiveTab('academy')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'academy' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          🎓 Academy
        </button>
        <button
          onClick={() => setActiveTab('training')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'training' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          📖 Training manual
        </button>
      </div>

      {/* Academy Tab */}
      {activeTab === 'academy' && (
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Restart Button */}
            <button 
              onClick={handleResetProgress}
              className="mb-4 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors"
            >
              ↺ Restart academy
            </button>

            {/* Search & Filter */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface border border-gray-700 text-white rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="bg-surface border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>
                ))}
              </select>
            </div>

            {/* Level Progress Bar */}
            <div className="bg-surface rounded-lg p-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/20 border-2 border-primary rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{level}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">LEVEL</span>
                    <span className="text-xs text-gray-400">{xpToNext} XP to level {level + 1}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-white">{totalXp} XP</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(xpInLevel / 400) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl">🔥</span>
                  <p className="text-xs text-gray-400">1 day</p>
                </div>
              </div>
            </div>

            {/* Streak Message */}
            <div className="flex items-center gap-3 mb-6 p-3 bg-surface rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✦</span>
              </div>
              <p className="text-gray-300 text-sm">
                <span className="font-bold text-white">{completedCount} of {totalClasses} done.</span> Keep the streak alive.
              </p>
            </div>

            {/* Tiers */}
            {tierInfo.map(tier => {
              const tierClasses = filteredClasses.filter(c => c.tier === tier.tier);
              const unlocked = isTierUnlocked(tier.tier);
              const isExpanded = expandedTiers[tier.tier];
              
              if (tierClasses.length === 0) return null;
              
              return (
                <div key={tier.tier} className="mb-6">
                  <button
                    onClick={() => toggleTier(tier.tier)}
                    className="w-full flex items-center justify-between mb-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xl font-bold ${tier.color}`}>
                        TIER {tier.tier} {tier.name}
                      </span>
                      {!unlocked && (
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                          🔒 finish the tier above
                        </span>
                      )}
                      <span className="text-gray-500 text-xs">({tierClasses.length} classes)</span>
                    </div>
                    <span className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  
                  {isExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tierClasses.map(classItem => {
                        const forYou = isForYou(classItem.id);
                        return (
                          <div
                            key={classItem.id}
                            onClick={() => unlocked && setSelectedClass(classItem)}
                            className={`bg-surface border rounded-lg p-4 cursor-pointer transition-all ${
                              classItem.completed 
                                ? 'border-emerald-500/50 bg-emerald-500/5' 
                                : unlocked 
                                  ? 'border-gray-700 hover:border-primary' 
                                  : 'border-gray-800 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">
                                {classItem.category}
                              </span>
                              {forYou && (
                                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                                  FOR YOU
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 mb-2">
                              {!unlocked && <span className="text-gray-500">🔒</span>}
                              {classItem.completed && <span className="text-emerald-400">✓</span>}
                              <h3 className={`font-bold ${classItem.completed ? 'text-emerald-400' : 'text-white'}`}>
                                {classItem.title}
                              </h3>
                            </div>
                            
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span className="text-accent">+{classItem.xp} XP</span>
                              <span>{classItem.time}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Role Selector - Right Sidebar */}
          <div className="w-72 flex-shrink-0">
            <div className="bg-surface rounded-lg p-4 sticky top-6">
              <h3 className="font-bold text-white mb-2">What&apos;s your role?</h3>
              <p className="text-gray-400 text-xs mb-4">I&apos;ll line up the classes you need first. You can take any of them, anytime.</p>
              
              <div className="space-y-2">
                {[
                  { id: 'owner', label: 'Owner / Producer', icon: '👑' },
                  { id: 'sales', label: 'Sales / Account', icon: '💼' },
                  { id: 'producer', label: 'Producer / Coordinator', icon: '🎬' },
                  { id: 'crew', label: 'Crew / Editor', icon: '🎥' },
                  { id: 'marketing', label: 'Marketing', icon: '📣' },
                  { id: 'finance', label: 'Finance / Ops', icon: '💰' },
                ].map(role => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id as UserRole)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      selectedRole === role.id 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-lg">{role.icon}</span>
                    <span className="text-sm font-medium">{role.label}</span>
                    {selectedRole === role.id && <span className="ml-auto">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Field Guide Tab */}
      {activeTab === 'field-guide' && (
        <div className="bg-[#f5f0e6] rounded-lg p-8 text-[#211c14]">
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-[#211c14] pb-6">
            <div className="flex justify-center items-center gap-4 mb-4">
              <span className="text-4xl">🎬</span>
              <h1 className="text-3xl font-bold uppercase tracking-wider">STUDIO OS - FIELD GUIDE</h1>
              <div className="border-2 border-[#211c14] rounded-full px-3 py-1">
                <span className="text-xs font-bold uppercase">★ STUDIO OS ★<br/>APPROVED<br/>EST. CHICAGO</span>
              </div>
            </div>
            <p className="text-sm italic">How to run your studio - a handy primer for every team member!</p>
          </div>

          {/* Job Movement */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-center uppercase tracking-wider mb-6">HOW A JOB MOVES THROUGH STUDIO OS</h2>
            <div className="flex items-center justify-between relative">
              <div className="absolute inset-x-0 top-1/2 h-0.5 border-t-2 border-dashed border-[#211c14] -z-10"></div>
              {[
                { num: 1, title: 'INQUIRY', desc: 'A lead lands in the Pipeline' },
                { num: 2, title: 'BOOK IT', desc: "Win the deal → it's a Project" },
                { num: 3, title: 'STAFF UP', desc: 'Crew & cast onboard themselves' },
                { num: 4, title: 'SHOOT', desc: 'Dates, gear, call sheet' },
                { num: 5, title: 'DELIVER', desc: 'Films land in the viewing room' },
                { num: 6, title: 'GET PAID', desc: 'Send the invoice, get paid' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#ECE4CF] border-3 border-[#211c14] flex items-center justify-center mb-2">
                    <span className="text-3xl font-bold">{step.num}</span>
                  </div>
                  <span className="font-bold text-xs tracking-wider">{step.title}</span>
                  <span className="text-xs text-[#5c5443] mt-1 max-w-[100px]">{step.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footage Movement */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-center uppercase tracking-wider mb-6">HOW YOUR FOOTAGE MOVES</h2>
            <div className="flex items-center justify-between relative">
              <div className="absolute inset-x-0 top-1/2 h-0.5 border-t-2 border-dashed border-[#211c14] -z-10"></div>
              {[
                { num: 1, title: 'SHOOT', desc: 'Cards come off the camera' },
                { num: 2, title: 'OFFLOAD', desc: 'The DIT ingests it to the project' },
                { num: 3, title: 'PROXIES', desc: 'Light copies made + uploaded' },
                { num: 4, title: 'EDIT', desc: 'Editors pull & cut anywhere' },
                { num: 5, title: 'SEND BACK', desc: 'Cuts return as versions' },
                { num: 6, title: 'CONFORM', desc: 'Relinked to the full-res originals' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#ECE4CF] border-3 border-[#211c14] flex items-center justify-center mb-2">
                    <span className="text-3xl font-bold">{step.num}</span>
                  </div>
                  <span className="font-bold text-xs tracking-wider">{step.title}</span>
                  <span className="text-xs text-[#5c5443] mt-1 max-w-[100px]">{step.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Getting Started */}
          <div className="border-t-2 border-[#211c14] pt-6">
            <h2 className="text-xl font-bold uppercase tracking-wider mb-4">GETTING STARTED</h2>
            <div className="space-y-4">
              {[
                { num: 1, title: 'Find your way around', items: ['Pipeline — deals you\'re chasing', 'Projects — booked work', 'Contacts — your people', 'Tasks & Calendar — the schedule'] },
                { num: 2, title: 'Add a contact', items: ['Contacts → New', 'Add name + email, set the type', 'Save — attach to deals & projects'] },
                { num: 3, title: 'Win the work — Pipeline', items: ['Start a deal on the contact', 'Drag it across stages', 'Mark it Won → becomes a project'] },
                { num: 4, title: 'Run a project', items: ['Open the project', 'Use tabs: Overview · Tasks · Crew · Media · Billing', 'Update status & progress'] },
              ].map((step) => (
                <div key={step.num} className="bg-[#ECE4CF] rounded-lg p-4">
                  <h3 className="font-bold mb-2">{step.num}. {step.title}</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {step.items.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Training Manual Tab */}
      {activeTab === 'training' && (
        <div>
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search the manual..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-gray-700 text-white rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="bg-white rounded-lg p-8 text-gray-900 max-w-4xl mx-auto">
            <div className="text-center mb-8 border-b border-gray-300 pb-6">
              <h1 className="text-3xl font-bold uppercase tracking-wider">STUDIO OS</h1>
              <p className="text-xl text-gray-600">User Training Manual</p>
              <p className="text-sm text-gray-500 mt-2 italic">A field guide for new users - from lead to delivery to the next job.</p>
            </div>

            <div className="space-y-6">
              {trainingSections
                .filter(section => 
                  searchQuery === '' || 
                  section.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((section) => (
                <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{section.icon}</span>
                      <span className="font-bold">{section.title}</span>
                    </div>
                    <span className={`text-gray-400 transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  
                  {expandedSection === section.id && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm">
                      {section.id === 'intro' && (
                        <div className="space-y-3">
                          <p>Studio OS is one app that runs an entire production studio. Instead of stitching together a CRM, a project manager, an invoicing tool, a file-delivery service, a ticketing platform, an email marketing tool, a website builder, and a payroll spreadsheet, everything lives in one connected system.</p>
                          <p>The whole app is built around a single journey - the path a job takes through your business: <strong>Inquiry → Deal → Booked Project → Shoot → Edit → Client Delivery → Payment → Marketing the result.</strong></p>
                          <p>An AI assistant named <strong>Kyra</strong> helps at every step, and a game-style academy teaches the whole flow hands-on.</p>
                        </div>
                      )}
                      {section.id === 'concepts' && (
                        <div className="space-y-2">
                          {[
                            { term: 'Kyra', desc: 'The built-in AI assistant. Answers questions, drafts content, and can take actions.' },
                            { term: 'Contact & "hats"', desc: 'One person record can wear many hats: Client, Lead, Crew, etc.' },
                            { term: 'Deal', desc: 'A potential sale moving through Pipeline stages.' },
                            { term: 'Project', desc: 'A booked job. The workspace where production work lives.' },
                            { term: 'Token link', desc: 'A public web link where the link itself is the password.' },
                            { term: 'Review Queue', desc: "An approvals inbox where Kyra's suggestions wait for your yes." },
                          ].map((item) => (
                            <div key={item.term} className="bg-white rounded p-2">
                              <span className="font-bold text-primary">{item.term}</span>
                              <span className="text-gray-600"> — {item.desc}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {section.id === 'gotchas' && (
                        <div className="space-y-2">
                          {[
                            { issue: "Your sidebar isn't everyone's sidebar", fix: 'Role and permissions hide sections.' },
                            { issue: 'Nothing auto-posts', fix: 'Broadcast produces drafts you copy out manually.' },
                            { issue: 'Token links are passwords', fix: 'Anyone with the link can open the content.' },
                          ].map((item) => (
                            <div key={item.issue} className="bg-white rounded p-2">
                              <p className="font-bold text-red-600">{item.issue}</p>
                              <p className="text-gray-600">{item.fix}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {!['intro', 'concepts', 'gotchas'].includes(section.id) && (
                        <p className="text-gray-600">Content for this section is available in the full manual.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Class Detail Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-medium text-cyan-400 uppercase">{selectedClass.category}</span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedClass.title}</h2>
                <p className="text-accent text-sm">+{selectedClass.xp} XP · {selectedClass.time}</p>
              </div>
              <button onClick={() => setSelectedClass(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <p className="text-gray-300 mb-6">{selectedClass.description}</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedClass(null)}
                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  handleCompleteClass(selectedClass.id);
                  setSelectedClass(null);
                }}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                Complete (+{selectedClass.xp} XP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}