'use client';

import React, { useState, useEffect } from 'react';

// --- IMPORTS ---
import { Tree } from 'primereact/tree';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { Dialog } from 'primereact/dialog'; // <--- Komponen Popup
import { TreeNode } from 'primereact/treenode';
import { Badge } from 'primereact/badge';
import { Skeleton } from 'primereact/skeleton';
import { Tag } from 'primereact/tag';

// --- 1. TYPESCRIPT INTERFACES ---

type StatusType = 'online' | 'away' | 'offline';

interface Employee {
    id: number;
    name: string;
    role: string;
    avatar: string;
    status: StatusType;
    isLeader?: boolean;
    // Data Tambahan untuk Profil Singkat
    phone: string;
    email: string;
    joinDate: string;
}

interface LocationData {
    title: string;
    description: string;
    employees: Employee[];
}

const OrganisasiPage = () => {

    // --- 2. DATA DAMI ---
    const treeNodes: TreeNode[] = [
        {
            key: 'pusat',
            label: 'Kantor Pusat (HO)',
            data: 'pusat',
            icon: 'pi pi-building',
            children: [
                {
                    key: 'reg-jatim',
                    label: 'Regional Jawa Timur',
                    data: 'reg-jatim',
                    icon: 'pi pi-map',
                    expanded: true, 
                    children: [
                        { key: 'cab-madiun', label: 'Cabang Madiun', data: 'cab-madiun', icon: 'pi pi-home' },
                        { key: 'cab-surabaya', label: 'Cabang Surabaya', data: 'cab-surabaya', icon: 'pi pi-home' },
                        { key: 'cab-malang', label: 'Cabang Malang', data: 'cab-malang', icon: 'pi pi-home' }
                    ]
                },
                {
                    key: 'reg-jabar',
                    label: 'Regional Jawa Barat',
                    data: 'reg-jabar',
                    icon: 'pi pi-map',
                    children: [
                        { key: 'cab-bandung', label: 'Cabang Bandung', data: 'cab-bandung', icon: 'pi pi-home' }
                    ]
                }
            ]
        }
    ];

    const EMPLOYEES_DB: Record<string, LocationData> = {
        'pusat': {
            title: 'Kantor Pusat Jakarta',
            description: 'Direksi dan Manajemen Utama',
            employees: [
                { id: 1, name: 'Bapak CEO', role: 'Chief Executive Officer', avatar: 'https://i.pravatar.cc/150?u=ceo', status: 'online', isLeader: true, phone: '0812-3456-7890', email: 'ceo@company.com', joinDate: 'Jan 2010' },
                { id: 2, name: 'Ibu HRD', role: 'HR Director', avatar: 'https://i.pravatar.cc/150?u=hrd', status: 'away', phone: '0812-9999-8888', email: 'hrd@company.com', joinDate: 'Mar 2015' }
            ]
        },
        'reg-jatim': {
            title: 'Regional Office - Jawa Timur',
            description: 'Pusat operasional wilayah timur',
            employees: [
                { id: 3, name: 'Agus Salim', role: 'Regional Manager', avatar: 'https://i.pravatar.cc/150?u=agus', status: 'online', isLeader: true, phone: '0813-5555-4444', email: 'agus@company.com', joinDate: 'Feb 2018' },
                { id: 4, name: 'Admin Regional', role: 'Regional Admin', avatar: 'https://i.pravatar.cc/150?u=adminreg', status: 'online', phone: '0813-1111-2222', email: 'admin.jatim@company.com', joinDate: 'Aug 2020' }
            ]
        },
        'cab-madiun': {
            title: 'Cabang Madiun',
            description: 'Unit Operasional Madiun',
            employees: [
                { id: 10, name: 'Budi Santoso', role: 'Kepala Cabang', avatar: 'https://i.pravatar.cc/150?u=budi', status: 'online', isLeader: true, phone: '0857-1234-5678', email: 'budi.santoso@company.com', joinDate: 'Jul 2019' },
                { id: 11, name: 'Siti Aminah', role: 'Finance', avatar: 'https://i.pravatar.cc/150?u=siti', status: 'away', phone: '0857-8765-4321', email: 'siti.aminah@company.com', joinDate: 'Dec 2021' },
                { id: 12, name: 'Joko Anwar', role: 'General Affair', avatar: 'https://i.pravatar.cc/150?u=joko', status: 'online', phone: '0857-1122-3344', email: 'joko.anwar@company.com', joinDate: 'May 2022' }
            ]
        },
        'cab-surabaya': {
            title: 'Cabang Surabaya',
            description: 'Unit Operasional Surabaya',
            employees: [
                { id: 20, name: 'Rina Nose', role: 'Kepala Cabang', avatar: 'https://i.pravatar.cc/150?u=rina', status: 'offline', isLeader: true, phone: '0811-3333-4444', email: 'rina@company.com', joinDate: 'Jan 2017' },
                { id: 21, name: 'Doni Tata', role: 'Marketing', avatar: 'https://i.pravatar.cc/150?u=doni', status: 'online', phone: '0811-2222-1111', email: 'doni@company.com', joinDate: 'Jun 2023' }
            ]
        }
    };

    // --- 3. STATE ---
    const [selectedKey, setSelectedKey] = useState<string | any>('cab-madiun'); 
    const [currentData, setCurrentData] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);

    // STATE BARU: Untuk Mengontrol Popup Profil
    const [profileDialogVisible, setProfileDialogVisible] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    // --- 4. EFFECTS ---
    useEffect(() => {
        setLoading(true);
        if (mobileSidebarVisible) setMobileSidebarVisible(false);

        setTimeout(() => {
            const data = EMPLOYEES_DB[selectedKey as string] || { 
                title: 'Data Tidak Ditemukan', 
                description: 'Pilih unit lain', 
                employees: [] 
            };
            setCurrentData(data);
            setLoading(false);
        }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKey]);

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'online': return 'bg-green-500';
            case 'away': return 'bg-yellow-500';
            default: return 'bg-gray-400';
        }
    };

    // Fungsi Trigger Buka Profil
    const handleOpenProfile = (emp: Employee) => {
        setSelectedEmployee(emp);
        setProfileDialogVisible(true);
    };

    // --- 5. KOMPONEN TREE REUSABLE ---
    const TreeContent = () => (
        <div className="p-2">
            <div className="text-xl font-bold text-900 mb-4 flex align-items-center gap-2">
                <i className="pi pi-sitemap text-primary"></i> Struktur Organisasi
            </div>
            <Tree 
                value={treeNodes} 
                selectionMode="single" 
                selectionKeys={selectedKey} 
                onSelectionChange={(e) => setSelectedKey(e.value)}
                className="w-full border-none p-0 text-sm"
                pt={{
                    root: { className: 'border-none' },
                    content: { className: 'border-round-lg hover:surface-100 p-2 transition-duration-200 cursor-pointer' },
                    label: { className: 'font-medium text-700' }
                }}
            />
        </div>
    );

    // --- 6. RENDER UI ---
    return (
        <div className="surface-ground min-h-screen p-3 md:p-4 font-inter">
            
            {/* MOBILE BUTTON */}
            <div className="md:hidden mb-3">
                <Button 
                    label="Pilih Cabang / Struktur" 
                    icon="pi pi-align-left" 
                    className="w-full p-button-outlined surface-card text-900 border-none shadow-1" 
                    onClick={() => setMobileSidebarVisible(true)} 
                />
            </div>

            {/* SIDEBAR MOBILE */}
            <Sidebar visible={mobileSidebarVisible} onHide={() => setMobileSidebarVisible(false)}>
                <TreeContent />
            </Sidebar>

            <div className="grid">
                
                {/* KOLOM KIRI (DESKTOP) */}
                <div className="hidden md:block col-12 md:col-4 lg:col-3">
                    <div className="surface-card p-3 shadow-2 border-round-xl h-full">
                        <TreeContent />
                    </div>
                </div>

                {/* KOLOM KANAN (KONTEN) */}
                <div className="col-12 md:col-8 lg:col-9">
                    
                    <div className="surface-card p-4 shadow-1 border-round-xl mb-4 border-left-3 border-primary-500 flex flex-column md:flex-row justify-content-between md:align-items-center gap-3">
                        <div>
                            {loading ? (
                                <Skeleton width="10rem" height="2rem" className="mb-2"></Skeleton>
                            ) : (
                                <h1 className="text-2xl font-bold text-900 m-0">{currentData?.title}</h1>
                            )}
                            {loading ? (
                                <Skeleton width="15rem" height="1rem"></Skeleton>
                            ) : (
                                <p className="text-500 m-0 mt-1 text-sm">{currentData?.description}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                             <Button icon="pi pi-search" className="p-button-rounded p-button-text p-button-secondary" aria-label="Search" />
                        </div>
                    </div>

                    {/* GRID KARYAWAN */}
                    <div className="grid">
                        {loading ? (
                            [1,2,3].map(i => (
                                <div key={i} className="col-12 md:col-6 lg:col-4">
                                    <div className="surface-card p-4 shadow-1 border-round-xl">
                                        <div className="flex align-items-center gap-3">
                                            <Skeleton shape="circle" size="4rem"></Skeleton>
                                            <div className="flex-1"><Skeleton width="60%" className="mb-2"></Skeleton><Skeleton width="40%"></Skeleton></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            currentData?.employees.map((emp) => (
                                <div key={emp.id} className="col-12 md:col-6 lg:col-4">
                                    <div className={`surface-card p-3 shadow-2 border-round-xl h-full relative hover:shadow-4 transition-all cursor-pointer border-top-3 ${emp.isLeader ? 'border-primary' : 'border-transparent'}`}>
                                        
                                        {emp.isLeader && (
                                            <div className="absolute top-0 right-0 mt-2 mr-2">
                                                <Badge value="HEAD" severity="info" className="text-xs"></Badge>
                                            </div>
                                        )}

                                        <div className="flex align-items-center gap-3">
                                            <div className="relative">
                                                <Avatar image={emp.avatar} size="large" shape="circle" />
                                                <div className={`absolute bottom-0 right-0 w-0.8rem h-0.8rem border-circle border-2 border-white ${getStatusColor(emp.status)}`}></div>
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="font-bold text-900 white-space-nowrap overflow-hidden text-overflow-ellipsis">{emp.name}</div>
                                                <div className="text-sm text-500">{emp.role}</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-3 pt-3 border-top-1 surface-border">
                                            <Button label="Chat" icon="pi pi-comments" size="small" className="p-button-outlined p-button-secondary w-6 text-xs" />
                                            {/* TOMBOL PROFIL YANG SUDAH DIAKTIFKAN */}
                                            <Button 
                                                label="Profil" 
                                                icon="pi pi-user" 
                                                size="small" 
                                                className="p-button-outlined w-6 text-xs" 
                                                onClick={() => handleOpenProfile(emp)} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {!loading && currentData?.employees.length === 0 && (
                            <div className="col-12 text-center p-6"><div className="text-900 font-bold text-xl">Tidak ada data</div></div>
                        )}
                    </div>
                </div>
            </div>

            {/* === DIALOG / POPUP PROFIL SINGKAT === */}
            <Dialog 
                header="Profil Singkat" 
                visible={profileDialogVisible} 
                style={{ width: '90vw', maxWidth: '400px' }} 
                onHide={() => setProfileDialogVisible(false)}
                draggable={false}
                modal
                className="font-inter"
            >
                {selectedEmployee && (
                    <div className="flex flex-column align-items-center text-center pt-2">
                        
                        {/* 1. Foto Besar */}
                        <div className="relative mb-3">
                            <Avatar image={selectedEmployee.avatar} size="xlarge" shape="circle" className="w-6rem h-6rem shadow-2" />
                            <div className={`absolute bottom-0 right-0 w-1.5rem h-1.5rem border-circle border-2 border-white ${getStatusColor(selectedEmployee.status)}`}></div>
                        </div>

                        {/* 2. Nama & Jabatan */}
                        <h2 className="text-xl font-bold text-900 m-0 mb-1">{selectedEmployee.name}</h2>
                        <Tag value={selectedEmployee.role} severity="info" className="mb-4"></Tag>

                        {/* 3. Detail Kontak (Card Abu-abu) */}
                        <div className="w-full surface-100 border-round-xl p-3 flex flex-column gap-3 text-left">
                            
                            {/* No Telpon */}
                            <div className="flex align-items-center gap-3">
                                <div className="bg-white p-2 border-round shadow-1 text-primary">
                                    <i className="pi pi-phone text-lg"></i>
                                </div>
                                <div>
                                    <div className="text-xs text-500 uppercase font-bold">No. Telepon</div>
                                    <div className="font-medium text-900">{selectedEmployee.phone}</div>
                                </div>
                                <Button icon="pi pi-copy" rounded text severity="secondary" className="ml-auto w-2rem h-2rem" tooltip="Salin" />
                            </div>

                            {/* Email */}
                            <div className="flex align-items-center gap-3">
                                <div className="bg-white p-2 border-round shadow-1 text-primary">
                                    <i className="pi pi-envelope text-lg"></i>
                                </div>
                                <div>
                                    <div className="text-xs text-500 uppercase font-bold">Email</div>
                                    <div className="font-medium text-900 text-sm">{selectedEmployee.email}</div>
                                </div>
                            </div>

                            {/* Tanggal Bergabung */}
                            <div className="flex align-items-center gap-3">
                                <div className="bg-white p-2 border-round shadow-1 text-primary">
                                    <i className="pi pi-calendar text-lg"></i>
                                </div>
                                <div>
                                    <div className="text-xs text-500 uppercase font-bold">Bergabung Sejak</div>
                                    <div className="font-medium text-900">{selectedEmployee.joinDate}</div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Tombol Aksi */}
                        <div className="flex w-full gap-2 mt-4">
                            <Button label="Chat WhatsApp" icon="pi pi-whatsapp" severity="success" className="w-full" />
                            <Button label="Detail Lengkap" icon="pi pi-external-link" severity="secondary" className="w-full p-button-outlined" />
                        </div>
                    </div>
                )}
            </Dialog>

        </div>
    );
}

export default OrganisasiPage;