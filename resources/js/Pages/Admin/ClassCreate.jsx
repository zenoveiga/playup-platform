import AdminLayout from '@/Layouts/AdminLayout';
import SchoolAdminLayout from '@/Layouts/SchoolAdminLayout';
import { Head, usePage, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ClassCreate() {
    const { auth } = usePage().props;
    const user = auth.user;
    const isSchoolAdmin = user.role === 'school_admin';
    const Layout = isSchoolAdmin ? SchoolAdminLayout : AdminLayout;

    const indexRoute = isSchoolAdmin ? 'school-admin.classes.index' : 'admin.classes.index';
    const storeRoute = isSchoolAdmin ? 'school-admin.classes.store' : 'admin.classes.store';

    // Form data tracking via Inertia useForm
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        room: '',
        schedule: '',
        teacher: '',
        days: ['Segunda', 'Quarta', 'Sexta'], // Pre-selected segment matching screenshot state
        start_date: '',
        end_date: '',
        status: 'active',
    });

    const handleDayToggle = (day) => {
        const currentDays = [...data.days];
        const index = currentDays.indexOf(day);
        if (index > -1) {
            currentDays.splice(index, 1);
        } else {
            currentDays.push(day);
        }
        setData('days', currentDays);
    };

    const toggleStatus = () => {
        setData('status', data.status === 'active' ? 'inactive' : 'active');
    };

    const submit = (e) => {
        e.preventDefault();
        post(route(storeRoute));
    };

    // Calculate real-time checklist completion
    const step1 = !!data.name;
    const step2 = data.days.length > 0;
    const step3 = !!data.room;
    const step4 = !!data.teacher;
    const step5 = step1 && step2 && step3 && step4 && !!data.start_date && !!data.end_date;

    const completedStepsCount = [step1, step2, step3, step4, step5].filter(Boolean).length;

    // Determine the active step index (0 to 4) for the custom dot styling
    let activeStepIdx = 0;
    if (step1) activeStepIdx = 1;
    if (step1 && step2) activeStepIdx = 2;
    if (step1 && step2 && step3) activeStepIdx = 3;
    if (step1 && step2 && step3 && step4) activeStepIdx = 4;

    return (
        <Layout>
            <Head title="Cadastrar Nova Turma | PlayUp Velocity" />

            <div className="max-w-6xl mx-auto p-8 space-y-8 animate-in fade-in duration-700 bg-surface pb-36 relative">
                {/* Top App Bar Breadcrumbs & Back */}
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black font-headline text-[#003346] tracking-tight leading-none mb-1">
                            Nova Turma
                        </h2>
                        <p className="text-on-surface/60 font-medium text-sm">
                            Preencha as informações básicas para iniciar uma nova turma de ensino.
                        </p>
                    </div>

                    <Link 
                        href={route(indexRoute)} 
                        className="flex items-center gap-2 text-primary font-bold hover:underline transition-all select-none text-sm"
                    >
                        <span className="material-symbols-outlined text-md">arrow_back</span>
                        <span>Voltar para lista</span>
                    </Link>
                </div>

                {/* Bento Form Grid */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Main Form Card */}
                    <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-outline-variant/10 dark:border-slate-800 shadow-sm">
                        <form onSubmit={submit} className="space-y-8">
                            {/* Section: Identificação */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl">badge</span>
                                    </span>
                                    <h4 className="text-xl font-bold font-headline text-[#003346] dark:text-white">Identificação da Turma</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#003346]/70 dark:text-[#87b3cd] ml-1">Nome da Turma</label>
                                        <input 
                                            type="text" 
                                            placeholder="Ex: Robótica Kids A - 2024"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full h-12 px-4 rounded-xl border border-outline-variant/20 bg-[#eff8ff] dark:bg-slate-950 transition-all text-[#003346] dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
                                        />
                                        {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#003346]/70 dark:text-[#87b3cd] ml-1">Sala / Ambiente</label>
                                        <select 
                                            value={data.room}
                                            onChange={(e) => setData('room', e.target.value)}
                                            className="w-full h-12 px-4 rounded-xl border border-outline-variant/20 bg-[#eff8ff] dark:bg-slate-950 transition-all text-[#003346] dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none cursor-pointer"
                                        >
                                            <option value="">Selecione uma sala</option>
                                            <option value="Laboratório 01">Laboratório 01</option>
                                            <option value="Sala de Artes 02">Sala de Artes 02</option>
                                            <option value="Auditório Central">Auditório Central</option>
                                            <option value="Espaço Maker">Espaço Maker</option>
                                        </select>
                                        {errors.room && <p className="text-xs text-error mt-1">{errors.room}</p>}
                                    </div>
                                </div>
                            </div>

                            <hr className="border-outline-variant/10 dark:border-slate-800"/>

                            {/* Section: Agendamento */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-secondary-container dark:bg-cyan-950 text-[#004e61] dark:text-cyan-400 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl">schedule</span>
                                    </span>
                                    <h4 className="text-xl font-bold font-headline text-[#003346] dark:text-white">Cronograma e Horários</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#003346]/70 dark:text-[#87b3cd] ml-1">Horário da Aula</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                placeholder="14:00 às 16:00"
                                                value={data.schedule}
                                                onChange={(e) => setData('schedule', e.target.value)}
                                                className="w-full h-12 pl-4 pr-10 rounded-xl border border-outline-variant/20 bg-[#eff8ff] dark:bg-slate-950 transition-all text-[#003346] dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
                                            />
                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface/40 pointer-events-none text-lg">access_time</span>
                                        </div>
                                        {errors.schedule && <p className="text-xs text-error mt-1">{errors.schedule}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#003346]/70 dark:text-[#87b3cd] ml-1">Professor Responsável</label>
                                        <select 
                                            value={data.teacher}
                                            onChange={(e) => setData('teacher', e.target.value)}
                                            className="w-full h-12 px-4 rounded-xl border border-outline-variant/20 bg-[#eff8ff] dark:bg-slate-950 transition-all text-[#003346] dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none cursor-pointer"
                                        >
                                            <option value="">Selecione um professor</option>
                                            <option value="Carlos Oliveira">Carlos Oliveira</option>
                                            <option value="Maria Eduarda">Maria Eduarda</option>
                                            <option value="Prof. Anderson Silva">Prof. Anderson Silva</option>
                                        </select>
                                        {errors.teacher && <p className="text-xs text-error mt-1">{errors.teacher}</p>}
                                    </div>

                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-sm font-bold text-[#003346]/70 dark:text-[#87b3cd] ml-1">Dias da Semana</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((day) => {
                                                const isSelected = data.days.includes(day);
                                                return (
                                                    <label key={day} className="cursor-pointer select-none">
                                                        <input 
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => handleDayToggle(day)}
                                                            className="hidden"
                                                        />
                                                        <div className={`px-5 py-2.5 rounded-2xl border text-sm font-bold whitespace-nowrap text-center transition-all ${
                                                            isSelected 
                                                                ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' 
                                                                : 'bg-[#eff8ff] dark:bg-slate-950 border-[#d2e7f7] dark:border-slate-800 text-[#003346] dark:text-[#87b3cd] hover:bg-[#cfecff]/50'
                                                        }`}>
                                                            {day}
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        {errors.days && <p className="text-xs text-error mt-1">{errors.days}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#003346]/70 dark:text-[#87b3cd] ml-1">Início da Turma</label>
                                        <input 
                                            type="date" 
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full h-12 px-4 rounded-xl border border-outline-variant/20 bg-[#eff8ff] dark:bg-slate-950 transition-all text-[#003346] dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
                                        />
                                        {errors.start_date && <p className="text-xs text-error mt-1">{errors.start_date}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#003346]/70 dark:text-[#87b3cd] ml-1">Término da Turma</label>
                                        <input 
                                            type="date" 
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="w-full h-12 px-4 rounded-xl border border-outline-variant/20 bg-[#eff8ff] dark:bg-slate-950 transition-all text-[#003346] dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
                                        />
                                        {errors.end_date && <p className="text-xs text-error mt-1">{errors.end_date}</p>}
                                    </div>
                                </div>
                            </div>

                            <hr className="border-outline-variant/10 dark:border-slate-800"/>

                            {/* Section: Status */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#eff8ff] dark:bg-slate-950 p-6 rounded-2xl gap-4">
                                <div className="flex items-center gap-4">
                                    <span className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-2xl">toggle_on</span>
                                    </span>
                                    <div>
                                        <h4 className="font-bold font-headline text-lg text-[#003346] dark:text-white">Disponibilidade da Turma</h4>
                                        <p className="text-xs text-[#507c94] dark:text-[#87b3cd] font-semibold">Turmas inativas não podem receber novas matrículas.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={toggleStatus}
                                        className="relative inline-flex items-center cursor-pointer select-none"
                                    >
                                        <div className="w-14 h-7 bg-outline-variant/40 dark:bg-slate-800 rounded-full transition-colors relative">
                                            <div className={`w-6 h-6 rounded-full bg-white shadow-sm transform transition-transform absolute top-[2px] left-[2px] ${
                                                data.status === 'active' ? 'translate-x-7 bg-white' : ''
                                            }`} />
                                            {data.status === 'active' && (
                                                <div className="absolute inset-0 bg-tertiary dark:bg-emerald-600 rounded-full z-0 flex items-center">
                                                    <div className="w-6 h-6 rounded-full bg-white shadow-sm translate-x-7 transform transition-transform" />
                                                </div>
                                            )}
                                        </div>
                                        <span className={`ms-3 text-sm font-bold uppercase tracking-widest ${
                                            data.status === 'active' ? 'text-tertiary dark:text-emerald-400 font-extrabold' : 'text-on-surface/40'
                                        }`}>
                                            {data.status === 'active' ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Fixed Footer Actions */}
                            <footer className="fixed bottom-0 left-72 right-0 bg-[#eff8ff]/85 dark:bg-slate-950/85 backdrop-blur-xl h-24 px-12 flex items-center justify-between shadow-[0_-8px_20px_-15px_rgba(0,0,0,0.1)] z-40 border-t border-outline-variant/10 dark:border-slate-800">
                                <div className="flex items-center gap-2 text-[#507c94] dark:text-[#87b3cd]/80">
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    <p className="text-xs font-medium font-label">As alterações não salvas serão perdidas ao sair.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={route(indexRoute)}
                                        className="w-full md:w-auto px-8 py-3.5 text-on-surface-variant text-center font-bold hover:bg-surface-container dark:hover:bg-slate-800 rounded-xl transition-all text-sm select-none"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full md:w-auto px-10 py-3.5 bg-gradient-to-br from-primary to-primary-dim text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
                                        <span>{processing ? 'Salvando...' : 'Salvar Turma'}</span>
                                    </button>
                                </div>
                            </footer>
                        </form>
                    </div>

                    {/* Secondary Column / Sidebar Panels */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        {/* Info / Context Card */}
                        <div className="bg-[#e2f3ff] dark:bg-slate-900 rounded-[2rem] p-8 border border-primary-container/20 shadow-sm space-y-4">
                            <h5 className="text-lg font-bold font-headline text-[#003346] dark:text-white">Informações Complementares</h5>
                            <ul className="space-y-4">
                                <li className="flex gap-4 items-start">
                                    <span className="material-symbols-outlined text-primary dark:text-[#00D1FF] text-xl mt-0.5">info</span>
                                    <p className="text-sm text-[#507c94] dark:text-[#87b3cd] leading-relaxed font-semibold">
                                        As turmas criadas ficam disponíveis imediatamente no portal do aluno caso o status esteja como <strong className="text-primary dark:text-[#00D1FF]">ATIVO</strong>.
                                    </p>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="material-symbols-outlined text-primary dark:text-[#00D1FF] text-xl mt-0.5">verified_user</span>
                                    <p className="text-sm text-[#507c94] dark:text-[#87b3cd] leading-relaxed font-semibold">
                                        Certifique-se de que o professor selecionado possua carga horária disponível para este turno.
                                    </p>
                                </li>
                            </ul>
                        </div>

                        {/* Image Panel */}
                        <div className="relative h-64 rounded-[2rem] overflow-hidden group shadow-lg border border-outline-variant/10 dark:border-slate-850">
                            <img 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFQzoEAJYKSxq6LAXhuyrG45dkixRo5vJjNWWfFdtbEpfWBfvfFQbm8VgaltE7dwxuV52A6zTE1YcwNM1rdpoSQseez1fzJgK-a-RUtcTLPcfKoIDa6IzD57IZyFj8cphx8B8F1X9vKGZX11EhDq7emRh-IZAb4tthmZRScnb0bwyVo7saF4a3U8AFQ-yLD7OmRLktxlvIDY8xJfKGV4Bh3z68PFUGXL4Fht4l1GoEqJvm7Mhe_CGn-vhkXgpk_1fI4PthXR3_FPk0"
                                alt="Modern Classroom"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent dark:from-slate-950/90 dark:to-transparent flex flex-col justify-end p-6">
                                <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Dica de Gestão</span>
                                <h6 className="text-white font-bold text-lg leading-tight">Mantenha a organização física dos polos atualizada.</h6>
                            </div>
                        </div>

                        {/* Checklist Tracking Panel */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-outline-variant/10 dark:border-slate-800 shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                                <h5 className="font-bold font-headline text-on-surface dark:text-white text-lg">Checklist de Cadastro</h5>
                                <span className="text-xs bg-tertiary/10 text-tertiary dark:bg-emerald-950 dark:text-emerald-400 px-3 py-1 rounded-full font-extrabold">
                                    {completedStepsCount}/5 Concluído
                                </span>
                            </div>
                            
                            <div className="space-y-4">
                                {/* Item 1: Nome e Identificacao */}
                                <div className="flex items-center gap-3">
                                    {step1 ? (
                                        <div className="w-6 h-6 rounded-full bg-tertiary text-white flex items-center justify-center flex-shrink-0 text-sm">
                                            <span className="material-symbols-outlined text-xs">done</span>
                                        </div>
                                    ) : activeStepIdx === 0 ? (
                                        <div className="w-6 h-6 rounded-full border-2 border-primary/30 bg-[#eff8ff] flex items-center justify-center flex-shrink-0">
                                            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#87b3cd]/40 flex items-center justify-center flex-shrink-0" />
                                    )}
                                    <span className={`text-sm font-medium transition-opacity ${step1 ? 'text-[#003346] dark:text-white font-semibold' : 'text-[#507c94] opacity-70'}`}>Nome e Identificação</span>
                                </div>

                                {/* Item 2: Definicao de Dias */}
                                <div className="flex items-center gap-3">
                                    {step2 ? (
                                        <div className="w-6 h-6 rounded-full bg-tertiary text-white flex items-center justify-center flex-shrink-0 text-sm">
                                            <span className="material-symbols-outlined text-xs">done</span>
                                        </div>
                                    ) : activeStepIdx === 1 ? (
                                        <div className="w-6 h-6 rounded-full border-2 border-primary/30 bg-[#eff8ff] flex items-center justify-center flex-shrink-0">
                                            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#87b3cd]/40 flex items-center justify-center flex-shrink-0" />
                                    )}
                                    <span className={`text-sm font-medium transition-opacity ${step2 ? 'text-[#003346] dark:text-white font-semibold' : 'text-[#507c94] opacity-70'}`}>Definição de Dias</span>
                                </div>

                                {/* Item 3: Vinculo de Sala */}
                                <div className="flex items-center gap-3">
                                    {step3 ? (
                                        <div className="w-6 h-6 rounded-full bg-tertiary text-white flex items-center justify-center flex-shrink-0 text-sm">
                                            <span className="material-symbols-outlined text-xs">done</span>
                                        </div>
                                    ) : activeStepIdx === 2 ? (
                                        <div className="w-6 h-6 rounded-full border-2 border-primary/30 bg-[#eff8ff] flex items-center justify-center flex-shrink-0">
                                            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#87b3cd]/40 flex items-center justify-center flex-shrink-0" />
                                    )}
                                    <span className={`text-sm font-medium transition-opacity ${step3 ? 'text-[#003346] dark:text-white font-semibold' : 'text-[#507c94] opacity-70'}`}>Vínculo de Sala</span>
                                </div>

                                {/* Item 4: Allocacao de Professor */}
                                <div className="flex items-center gap-3">
                                    {step4 ? (
                                        <div className="w-6 h-6 rounded-full bg-tertiary text-white flex items-center justify-center flex-shrink-0 text-sm">
                                            <span className="material-symbols-outlined text-xs">done</span>
                                        </div>
                                    ) : activeStepIdx === 3 ? (
                                        <div className="w-6 h-6 rounded-full border-2 border-primary/30 bg-[#eff8ff] flex items-center justify-center flex-shrink-0">
                                            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#87b3cd]/40 flex items-center justify-center flex-shrink-0" />
                                    )}
                                    <span className={`text-sm font-medium transition-opacity ${step4 ? 'text-[#003346] dark:text-white font-semibold' : 'text-[#507c94] opacity-70'}`}>Alocação de Professor</span>
                                </div>

                                {/* Item 5: Revisao e Ativacao */}
                                <div className="flex items-center gap-3">
                                    {step5 ? (
                                        <div className="w-6 h-6 rounded-full bg-tertiary text-white flex items-center justify-center flex-shrink-0 text-sm">
                                            <span className="material-symbols-outlined text-xs">done</span>
                                        </div>
                                    ) : activeStepIdx === 4 ? (
                                        <div className="w-6 h-6 rounded-full border-2 border-primary/30 bg-[#eff8ff] flex items-center justify-center flex-shrink-0">
                                            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#87b3cd]/40 flex items-center justify-center flex-shrink-0" />
                                    )}
                                    <span className={`text-sm font-medium transition-opacity ${step5 ? 'text-[#003346] dark:text-white font-semibold' : 'text-[#507c94] opacity-70'}`}>Revisão e Ativação</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
