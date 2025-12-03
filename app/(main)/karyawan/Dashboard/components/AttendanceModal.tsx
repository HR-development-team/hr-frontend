import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

interface AttendanceModalProps {
    visible: boolean;
    onHide: () => void;
    isLoading: boolean;
    isInRange: boolean;
    distance: number | null;
    maxDistance: number;
    officeName: string;
    actionRequired: string;
    onConfirm: () => void;
}

export default function AttendanceModal({
    visible,
    onHide,
    isLoading,
    isInRange,
    distance,
    maxDistance,
    officeName,
    actionRequired,
    onConfirm
}: AttendanceModalProps) {
    return (
        <Dialog 
            header="Verifikasi Lokasi" 
            visible={visible} 
            style={{ width: '90vw', maxWidth: '450px' }} 
            onHide={onHide}
            contentClassName="p-0 border-round-bottom-2xl"
            headerClassName="border-round-top-2xl surface-ground border-bottom-1 surface-border"
            modal
            draggable={false}
        >
            <div className="flex flex-column align-items-center p-5 text-center bg-white">
                <div className={`border-circle w-5rem h-5rem flex align-items-center justify-content-center mb-4 ${isLoading ? 'bg-blue-50' : (isInRange ? 'bg-green-50' : 'bg-red-50')}`}>
                    <i className={`pi ${isLoading ? 'pi-spin pi-compass text-blue-500' : (isInRange ? 'pi-check text-green-500' : 'pi-times text-red-500')} text-3xl`}></i>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {isLoading ? "Sedang Memindai GPS..." : (isInRange ? "Lokasi Terkonfirmasi" : "Di Luar Jangkauan")}
                </h2>
                
                <div className="text-gray-600 mb-4 line-height-3 text-sm bg-gray-50 p-3 border-round w-full">
                    {isLoading 
                        ? "Mohon tunggu, sistem sedang menghitung jarak Anda ke kantor."
                        : (
                            <>
                                <div>Jarak ke <strong>{officeName}</strong>:</div>
                                <div className="text-lg font-bold text-gray-800 my-1">{distance} meter</div>
                                <div className="text-xs text-gray-500">(Maksimal radius: {maxDistance}m)</div>
                            </>
                          )
                    }
                </div>

                {!isLoading && isInRange && (
                    <div className="w-full flex flex-column gap-2">
                        <Button label={`Ya, Lakukan ${actionRequired}`} icon="pi pi-check" className="w-full p-button-primary" onClick={onConfirm} />
                        <Button label="Batal" className="w-full p-button-text p-button-secondary" onClick={onHide} />
                    </div>
                )}
                {!isLoading && !isInRange && (
                    <div className="w-full flex flex-column gap-2">
                        {/* Tombol scan ulang memanggil onConfirm lagi karena di parent logic-nya sama (trigger GPS) */}
                        <Button label="Coba Scan Ulang" icon="pi pi-refresh" className="w-full p-button-outlined p-button-danger" onClick={onConfirm} />
                        <Button label="Tutup" className="w-full p-button-text p-button-secondary" onClick={onHide} />
                    </div>
                )}
            </div>
        </Dialog>
    );
}