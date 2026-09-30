/**
 * AI CAREER GUIDE & RESUME ANALYZER
 * Client-Side Application Controller
 */

const AppState = {
    activeTab: 'home',
    theme: localStorage.getItem('career_ai_theme') || 'system',
    roles: [],
    currentRole: 'Python Developer',
    profile: {
        name: localStorage.getItem('career_ai_user_name') || 'Alex',
        targetRole: 'Python Developer',
        currentSkills: ['Python', 'SQL', 'Git'],
        prepDays: 30,
        dailyHours: 2
    },
    dashboard: {
        targetRole: 'Python Developer',
        prepPct: 40,
        atsScore: 76,
        skillsCount: '12 / 18',
        currentDay: 12,
        totalDays: 30
    },
    roadmap: null,
    resumeAnalysis: null,
    completedDays: JSON.parse(localStorage.getItem('career_ai_completed_days') || '{"1":true,"2":true,"3":true}'),
    themeListenersAdded: false
};

// UI Toast Notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    const indicatorColor = type === 'success' ? '#22C55E' : (type === 'error' ? '#EF4444' : '#EC4899');
    toast.innerHTML = `<span style="width:7px;height:7px;border-radius:50%;background:${indicatorColor};display:inline-block"></span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.25s ease';
        setTimeout(() => toast.remove(), 250);
    }, 3200);
}

// Navigation Tab Management
function navigateTo(tabId) {
    AppState.activeTab = tabId;

    // Update Desktop & Mobile Sidebar Active Links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        if (link.dataset.tab === tabId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Update Content Views
    document.querySelectorAll('.app-page-view').forEach(view => {
        if (view.id === `view-${tabId}`) {
            view.classList.remove('hidden');
            view.classList.add('animate-fade-in');
        } else {
            view.classList.add('hidden');
            view.classList.remove('animate-fade-in');
        }
    });

    // Close Mobile Drawer if open
    closeMobileSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Hook tab specific loads
    if (tabId === 'dashboard') updateDashboardMetrics();
    if (tabId === 'resources') loadResources();
    if (tabId === 'interview') loadInterviewQuestions();
    if (tabId === 'progress') updateProgressView();
}

function toggleMobileSidebar() {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    if (drawer && overlay) {
        drawer.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    }
}

function closeMobileSidebar() {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    if (drawer && !drawer.classList.contains('-translate-x-full')) {
        drawer.classList.add('-translate-x-full');
    }
    if (overlay && !overlay.classList.contains('hidden')) {
        overlay.classList.add('hidden');
    }
}

// Theme Engine (Light / Dark / System Default)
function applyTheme(themeName) {
    AppState.theme = themeName;
    localStorage.setItem('career_ai_theme', themeName);

    const root = document.documentElement;
    if (themeName === 'dark') {
        root.setAttribute('data-theme', 'dark');
    } else if (themeName === 'light') {
        root.removeAttribute('data-theme');
    } else {
        // System
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
    }

    // Update settings radio UI if available
    const themeSelect = document.getElementById('settings-theme-select');
    if (themeSelect) themeSelect.value = themeName;
}

// Core App Initialization
async function initApp() {
    // 1. Theme Setup
    applyTheme(AppState.theme);
    if (!AppState.themeListenersAdded && window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (AppState.theme === 'system') applyTheme('system');
        });
        AppState.themeListenersAdded = true;
    }

    // 2. Fetch Roles Catalog
    try {
        const res = await fetch('/api/roles');
        const json = await res.json();
        if (json.success && json.data) {
            AppState.roles = json.data;
            populateRoleDropdowns();
        }
    } catch (e) {
        console.error('Error fetching roles:', e);
    }

    // 3. Bind UI Events
    bindAppEvents();

    // 4. Initial default roadmap & career diagnostics
    generateRoadmapPlan(false);
}

function populateRoleDropdowns() {
    const selects = ['career-target-role', 'resume-target-role', 'interview-target-role'];
    selects.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = AppState.roles.map(r => `
            <option value="${r.role}" ${r.role === AppState.currentRole ? 'selected' : ''}>${r.role}</option>
        `).join('');
    });
}

function bindAppEvents() {
    const careerRoleSelect = document.getElementById('career-target-role');
    if (careerRoleSelect) {
        careerRoleSelect.addEventListener('change', () => {
            AppState.profile.targetRole = careerRoleSelect.value;
            AppState.currentRole = careerRoleSelect.value;
            ['interview-target-role', 'resume-target-role'].forEach(id => {
                const roleSelect = document.getElementById(id);
                if (roleSelect) roleSelect.value = careerRoleSelect.value;
            });
            updateDashboardMetrics();
        });
    }

    // Career Guide Skill Chip Add
    const skillInput = document.getElementById('input-skill-chip');
    if (skillInput) {
        skillInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkillChip(skillInput.value);
                skillInput.value = '';
            }
        });
    }

    // File Upload Handler (PDF, DOCX, TXT)
    const fileInput = document.getElementById('resume-file-input');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }

    // Drag and drop zone
    const dropZone = document.getElementById('resume-drop-zone');
    if (dropZone) {
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropZone.classList.add('border-pink-500', 'bg-pink-50/50');
            }, false);
        });
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropZone.classList.remove('border-pink-500', 'bg-pink-50/50');
            }, false);
        });
        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files && files[0]) {
                handleUploadedFile(files[0]);
            }
        });
    }

    renderSkillChips();
}

function addSkillChip(skill) {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!AppState.profile.currentSkills.includes(trimmed)) {
        AppState.profile.currentSkills.push(trimmed);
        renderSkillChips();
    }
}

function removeSkillChip(skill) {
    AppState.profile.currentSkills = AppState.profile.currentSkills.filter(s => s !== skill);
    renderSkillChips();
}

function renderSkillChips() {
    const container = document.getElementById('career-skills-chips');
    if (!container) return;

    container.innerHTML = AppState.profile.currentSkills.map(skill => `
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800">
            <span>${skill}</span>
            <button type="button" onclick="removeSkillChip('${skill}')" class="text-pink-500 hover:text-pink-700">×</button>
        </span>
    `).join('');
}

// Roadmap Generation (Time-Aware)
async function generateRoadmapPlan(notify = true) {
    const roleSelect = document.getElementById('career-target-role');
    const daysSelect = document.getElementById('career-prep-days');
    const hoursSelect = document.getElementById('career-daily-hours');

    if (roleSelect) AppState.profile.targetRole = roleSelect.value;
    if (daysSelect) AppState.profile.prepDays = parseInt(daysSelect.value);
    if (hoursSelect) AppState.profile.dailyHours = parseFloat(hoursSelect.value);

    AppState.currentRole = AppState.profile.targetRole;

    const btn = document.getElementById('btn-generate-roadmap');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="inline-block animate-spin mr-2">✦</span> Building your personalized plan...`;
    }

    try {
        const res = await fetch('/api/career/roadmap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                targetRole: AppState.profile.targetRole,
                currentSkills: AppState.profile.currentSkills,
                prepDays: AppState.profile.prepDays,
                dailyHours: AppState.profile.dailyHours
            })
        });
        const json = await res.json();
        if (json.success && json.data) {
            AppState.roadmap = json.data;
            renderRoadmapUI(json.data);
            if (notify) {
                showToast(`Generated ${json.data.duration_days}-Day preparation plan (${json.data.total_hours} total hours)!`, 'success');
                navigateTo('roadmap');
            }
        }
    } catch (err) {
        console.error('Roadmap generation error:', err);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<span>✨ Generate My Roadmap</span>`;
        }
    }
}

function renderRoadmapUI(roadmap) {
    const headerTitle = document.getElementById('roadmap-title');
    const headerSummary = document.getElementById('roadmap-summary');
    const totalHoursEl = document.getElementById('roadmap-total-hours');
    const timelineContainer = document.getElementById('roadmap-timeline');

    if (headerTitle) headerTitle.textContent = `${roadmap.target_role} Preparation Roadmap`;
    if (headerSummary) headerSummary.textContent = roadmap.strategy_summary;
    if (totalHoursEl) totalHoursEl.textContent = `${roadmap.duration_days} Days · ${roadmap.daily_hours} hrs/day (${roadmap.total_hours} Total Hours)`;

    if (!timelineContainer) return;

    timelineContainer.innerHTML = roadmap.days.map((day, idx) => {
        const isDone = Boolean(AppState.completedDays[day.day_number]);
        return `
            <div class="border border-slate-200 dark:border-slate-800 rounded-lg p-5 mb-4 bg-white dark:bg-zinc-900 transition-all ${isDone ? 'opacity-80' : ''}">
                <div class="flex items-start justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <button onclick="toggleDayProgress(${day.day_number})" class="w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                            isDone 
                                ? 'bg-pink-600 border-pink-600 text-white' 
                                : 'border-slate-300 dark:border-zinc-700 hover:border-pink-500'
                        }">
                            ${isDone ? '✓' : ''}
                        </button>
                        <div>
                            <span class="text-xs font-mono font-bold text-pink-600 uppercase">Day ${day.day_number < 10 ? '0' + day.day_number : day.day_number} · ⏱ ${day.estimated_hours} Hours</span>
                            <h3 class="text-base font-bold mt-0.5 ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}">${day.topic}</h3>
                        </div>
                    </div>
                    <span class="text-[11px] px-2 py-0.5 rounded font-medium ${day.priority === 'High' ? 'bg-pink-50 dark:bg-pink-950/40 text-pink-600 border border-pink-200 dark:border-pink-900' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500'}">
                        ${day.priority} Priority
                    </span>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 space-y-2.5 text-xs">
                    <div>
                        <span class="font-semibold text-slate-700 dark:text-zinc-300">Topics to Learn:</span>
                        <ul class="list-disc list-inside mt-1 text-slate-600 dark:text-zinc-400 space-y-0.5">
                            ${day.learning_objectives.map(obj => `<li>${obj}</li>`).join('')}
                        </ul>
                    </div>
                    <a href="${day.youtube_url || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${roadmap.target_role} ${day.topic} tutorial course`)}` }" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 pt-1 text-pink-600 font-semibold hover:text-pink-700">
                        Watch YouTube lessons <span aria-hidden="true">↗</span>
                    </a>
                </div>
            </div>
        `;
    }).join('');

    updateRoadmapProgressMetrics();
}

function toggleDayProgress(dayNum) {
    const current = Boolean(AppState.completedDays[dayNum]);
    AppState.completedDays[dayNum] = !current;
    localStorage.setItem('career_ai_completed_days', JSON.stringify(AppState.completedDays));

    if (AppState.roadmap) {
        renderRoadmapUI(AppState.roadmap);
    }
}

function getRoadmapProgress() {
    const total = AppState.roadmap ? AppState.roadmap.duration_days : 30;
    const completed = Object.entries(AppState.completedDays).filter(([day, isDone]) =>
        isDone && Number(day) >= 1 && Number(day) <= total
    ).length;
    const pct = Math.min(100, Math.round((completed / total) * 100));
    return { total, completed, pct };
}

function updateRoadmapProgressMetrics() {
    const { total, completed, pct } = getRoadmapProgress();

    AppState.dashboard.prepPct = pct;
    AppState.dashboard.currentDay = completed;
    AppState.dashboard.totalDays = total;

    const bar = document.getElementById('roadmap-progress-bar');
    const text = document.getElementById('roadmap-progress-text');
    if (bar) bar.style.width = `${pct}%`;
    if (text) text.textContent = `${completed} of ${total} days completed (${pct}%)`;

    updateDashboardMetrics();
    updateProgressView();
}

// Resume File Upload & Parsing
async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (file) handleUploadedFile(file);
}

async function handleUploadedFile(file) {
    const statusEl = document.getElementById('resume-file-status');
    const nameEl = document.getElementById('resume-file-name');
    const textEl = document.getElementById('resume-text-input');

    if (nameEl) nameEl.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
    if (statusEl) statusEl.classList.remove('hidden');

    const formData = new FormData();
    formData.append('file', file);

    try {
        const res = await fetch('/api/resume/upload', {
            method: 'POST',
            body: formData
        });
        const json = await res.json();
        if (json.success && json.data) {
            if (textEl) textEl.value = json.data.text;
            showToast(`Extracted resume text successfully (${json.data.word_count} words)`, 'success');
        } else {
            showToast(json.error?.message || 'Error reading resume', 'error');
        }
    } catch (err) {
        console.error('Upload error:', err);
        showToast('Error uploading file', 'error');
    }
}

// Resume ATS Analysis (Explainable, No Fake Score)
async function analyzeResumeContent() {
    const textEl = document.getElementById('resume-text-input');
    const roleEl = document.getElementById('resume-target-role');
    const jdEl = document.getElementById('resume-jd-input');

    const resumeText = textEl?.value || '';
    const targetRole = roleEl?.value || 'Python Developer';
    const jobDescription = jdEl?.value || '';

    if (!resumeText.trim() || resumeText.trim().length < 30) {
        showToast('Please upload or paste your resume content before analyzing.', 'error');
        return;
    }

    const btn = document.getElementById('btn-analyze-resume');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="inline-block animate-spin mr-2">✦</span> Evaluating ATS Readiness...`;
    }

    try {
        const res = await fetch('/api/resume/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                resumeText: resumeText,
                targetRole: targetRole,
                jobDescription: jobDescription
            })
        });
        const json = await res.json();
        if (json.success && json.data) {
            AppState.resumeAnalysis = json.data;
            AppState.dashboard.atsScore = json.data.estimated_ats_readiness;
            renderATSResults(json.data);
            showToast('ATS Readiness evaluation complete!', 'success');
            
            // Scroll to results
            document.getElementById('ats-results-container')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            showToast(json.error?.message || 'Error analyzing resume', 'error');
        }
    } catch (err) {
        console.error('Analysis error:', err);
        showToast('Error communicating with ATS engine', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<span>Analyze Resume</span>`;
        }
    }
}

function renderATSResults(data) {
    const container = document.getElementById('ats-results-container');
    if (!container) return;

    container.classList.remove('hidden');

    // Score
    const scoreEl = document.getElementById('ats-score-display');
    if (scoreEl) scoreEl.textContent = data.estimated_ats_readiness;

    // Breakdown bars
    const b = data.breakdown;
    const breakdownContainer = document.getElementById('ats-breakdown-list');
    if (breakdownContainer) {
        breakdownContainer.innerHTML = Object.keys(b).map(k => {
            const item = b[k];
            const pct = Math.round((item.score / item.max) * 100);
            return `
                <div class="space-y-1">
                    <div class="flex justify-between text-xs">
                        <span class="text-slate-600 dark:text-zinc-400">${item.label}</span>
                        <span class="font-mono font-semibold">${item.score} / ${item.max}</span>
                    </div>
                    <div class="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div class="bg-pink-600 h-full rounded-full" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Matched skills with evidence
    const matchedEl = document.getElementById('ats-matched-skills');
    if (matchedEl) {
        matchedEl.innerHTML = data.matched_skills.map(m => `
            <div class="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs">
                <div class="font-semibold text-emerald-800 dark:text-emerald-300">✓ ${m.skill}</div>
                <div class="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">${m.evidence}</div>
            </div>
        `).join('') || '<div class="text-xs text-slate-400 italic">No core role skills detected.</div>';
    }

    // Missing skills
    const missingEl = document.getElementById('ats-missing-skills');
    if (missingEl) {
        missingEl.innerHTML = data.missing_skills.map(s => `
            <div class="p-2.5 rounded bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs">
                <div class="font-semibold text-rose-800 dark:text-rose-300">○ ${s}</div>
                <div class="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">Missing / Not Detected</div>
            </div>
        `).join('') || '<div class="text-xs text-emerald-600 font-medium">All essential skills detected!</div>';
    }

    // Strengths
    const strengthsEl = document.getElementById('ats-strengths-list');
    if (strengthsEl) {
        strengthsEl.innerHTML = data.strengths.map(str => `
            <li class="flex items-start gap-2 text-xs text-slate-700 dark:text-zinc-300">
                <span class="text-emerald-500 font-bold shrink-0">✓</span>
                <span>${str}</span>
            </li>
        `).join('');
    }

    // Improvements
    const improvementsEl = document.getElementById('ats-improvements-list');
    if (improvementsEl) {
        improvementsEl.innerHTML = data.improvements.map(imp => `
            <li class="flex items-start gap-2 text-xs text-slate-700 dark:text-zinc-300">
                <span class="text-pink-500 font-bold shrink-0">→</span>
                <span>${imp}</span>
            </li>
        `).join('');
    }

    // JD matching if provided
    const jdContainer = document.getElementById('ats-jd-analysis');
    if (jdContainer) {
        if (data.jd_analysis.has_jd) {
            jdContainer.classList.remove('hidden');
            document.getElementById('jd-matched-terms').innerHTML = data.jd_analysis.matched_terms.map(t => `<span class="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-mono">${t}</span>`).join('');
            document.getElementById('jd-missing-terms').innerHTML = data.jd_analysis.missing_terms.map(t => `<span class="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-xs font-mono">${t}</span>`).join('');
        } else {
            jdContainer.classList.add('hidden');
        }
    }
}

// Resources Service
async function loadResources() {
    const role = AppState.currentRole;
    const typeFilter = document.querySelector('.resource-type-filter.active')?.dataset.type || 'All';
    const searchQuery = document.getElementById('resource-search-input')?.value || '';

    try {
        const res = await fetch(`/api/resources?role=${encodeURIComponent(role)}&type=${encodeURIComponent(typeFilter)}&q=${encodeURIComponent(searchQuery)}`);
        const json = await res.json();
        if (json.success && json.data) {
            renderResourcesUI(json.data);
        }
    } catch (e) {
        console.error('Error fetching resources:', e);
    }
}

function filterResourcesByType(type, btn) {
    document.querySelectorAll('.resource-type-filter').forEach(b => b.classList.remove('active', 'bg-pink-600', 'text-white'));
    btn.classList.add('active', 'bg-pink-600', 'text-white');
    loadResources();
}

function renderResourcesUI(resources) {
    const grid = document.getElementById('resources-grid');
    if (!grid) return;

    if (!resources || resources.length === 0) {
        grid.innerHTML = `<div class="col-span-3 text-center py-12 text-slate-400 text-sm">No resources matched your current filter criteria.</div>`;
        return;
    }

    grid.innerHTML = resources.map(r => `
        <div class="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-zinc-900 flex flex-col justify-between hover:border-pink-500/50 transition-colors">
            <div class="space-y-3">
                <div class="flex items-center justify-between text-xs">
                    <span class="font-mono font-bold text-pink-600 uppercase tracking-wider">${r.type}</span>
                    <span class="text-slate-400">${r.level}</span>
                </div>
                <div>
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">${r.title}</h3>
                    <div class="text-xs text-pink-600 font-medium mt-0.5">${r.provider}</div>
                    <p class="text-xs text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">${r.description}</p>
                </div>
            </div>
            <div class="pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                <span class="text-[11px] font-semibold ${r.is_free ? 'text-emerald-600' : 'text-slate-500'}">
                    ${r.is_free ? '✓ Free Resource' : 'Paid Platform'}
                </span>
                <a href="${r.url}" target="_blank" rel="noreferrer" class="text-xs font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1">
                    <span>Open Resource →</span>
                </a>
            </div>
        </div>
    `).join('');
}

// Interview Preparation Module
async function loadInterviewQuestions() {
    const roleSelect = document.getElementById('interview-target-role');
    const catSelect = document.getElementById('interview-category-select');
    const diffSelect = document.getElementById('interview-difficulty-select');

    const role = roleSelect?.value || AppState.currentRole;
    const cat = catSelect?.value || 'All';
    const diff = diffSelect?.value || 'All';

    try {
        const res = await fetch(`/api/interview/questions?role=${encodeURIComponent(role)}&category=${encodeURIComponent(cat)}&difficulty=${encodeURIComponent(diff)}`);
        const json = await res.json();
        if (json.success && json.data) {
            renderInterviewQuestions(json.data);
        }
    } catch (e) {
        console.error('Error fetching interview questions:', e);
    }
}

function renderInterviewQuestions(questions) {
    const list = document.getElementById('interview-questions-list');
    if (!list) return;

    if (!questions || questions.length === 0) {
        list.innerHTML = `<div class="text-center py-12 text-slate-400 text-sm">No questions found for this criteria.</div>`;
        return;
    }

    list.innerHTML = questions.map((q, idx) => `
        <div class="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-zinc-900 space-y-3">
            <div class="flex items-center justify-between text-xs">
                <span class="font-mono text-pink-600 font-bold uppercase">${q.category} · ${q.difficulty}</span>
                <span class="text-slate-400 text-[11px]">${q.role}</span>
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                ${idx + 1 < 10 ? '0' + (idx + 1) : idx + 1}. ${q.question}
            </h3>
            
            <div>
                <button onclick="toggleAnswer('ans-${q.id}')" class="text-xs font-semibold text-pink-600 hover:text-pink-700 transition-colors">
                    [ Show Answer & Explanation ]
                </button>
            </div>

            <div id="ans-${q.id}" class="hidden pt-3 border-t border-slate-100 dark:border-zinc-800 space-y-2 text-xs">
                <div>
                    <span class="font-semibold text-slate-800 dark:text-zinc-200">Explanation:</span>
                    <p class="text-slate-600 dark:text-zinc-400 mt-0.5 leading-relaxed">${q.simple_explanation}</p>
                </div>
                ${q.example ? `
                    <div class="p-2.5 rounded bg-slate-50 dark:bg-zinc-800/60 font-mono text-[11px] text-slate-700 dark:text-zinc-300">
                        ${q.example}
                    </div>
                ` : ''}
                <div class="p-2 rounded bg-pink-50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300">
                    <span class="font-semibold">💡 Interview Tip: </span>${q.interview_tip}
                </div>
            </div>
        </div>
    `).join('');
}

function toggleAnswer(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden');
}

// Dashboard Updating
function updateDashboardMetrics() {
    const { completed, total, pct } = getRoadmapProgress();
    const roleEl = document.getElementById('dash-target-role');
    const prepEl = document.getElementById('dash-prep-pct');
    const atsEl = document.getElementById('dash-ats-score');
    const skillsEl = document.getElementById('dash-skills-count');
    const dayEl = document.getElementById('dash-current-day');
    const progressFill = document.getElementById('dash-progress-fill');

    if (roleEl) roleEl.textContent = AppState.currentRole;
    if (prepEl) prepEl.textContent = `${pct}%`;
    if (atsEl) atsEl.textContent = `${AppState.dashboard.atsScore} / 100`;
    if (skillsEl) skillsEl.textContent = AppState.dashboard.skillsCount;
    if (dayEl) dayEl.textContent = `Day ${completed} of ${total}`;
    if (progressFill) progressFill.style.width = `${pct}%`;
    const roadmapRole = document.getElementById('dash-roadmap-role');
    const progressText = document.getElementById('dash-progress-text');
    if (roadmapRole) roadmapRole.textContent = `${AppState.currentRole} Roadmap`;
    if (progressText) progressText.textContent = `${pct}% complete`;
}

// My Progress Updating
function updateProgressView() {
    const { completed, total, pct } = getRoadmapProgress();

    const pctEl = document.getElementById('prog-overall-pct');
    const daysEl = document.getElementById('prog-completed-days');
    const bar = document.getElementById('prog-bar');
    const roleEl = document.getElementById('prog-target-role');

    if (pctEl) pctEl.textContent = `${pct}%`;
    if (daysEl) daysEl.textContent = `${completed} / ${total} Days`;
    if (bar) bar.style.width = `${pct}%`;
    if (roleEl) roleEl.textContent = AppState.currentRole;
}

// Settings Saving
function saveSettings() {
    const nameInput = document.getElementById('settings-user-name');
    const themeSelect = document.getElementById('settings-theme-select');

    if (nameInput && nameInput.value.trim()) {
        AppState.profile.name = nameInput.value.trim();
        localStorage.setItem('career_ai_user_name', AppState.profile.name);
        const dashGreeting = document.getElementById('dash-user-greeting');
        if (dashGreeting) dashGreeting.textContent = AppState.profile.name;
    }

    if (themeSelect) {
        applyTheme(themeSelect.value);
    }

    showToast('Settings saved successfully', 'success');
}

// Start
document.addEventListener('DOMContentLoaded', initApp);
