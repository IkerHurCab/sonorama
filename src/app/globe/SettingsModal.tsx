import { X } from 'lucide-react';

export interface VisualSettings {
    rotationSpeed: number;
    showEffects: boolean;
}

export interface DisplaySettings {
    dateFormat: 'AC/DC' | 'BCE/CE';
    showNavbar: boolean;
    showFilters: boolean;
    showTimeline: boolean;
    showCameraButtons: boolean;
}

export interface Settings {
    visual: VisualSettings;
    display: DisplaySettings;
}

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: Settings;
    onSettingsChange: (newSettings: Settings) => void;
    buttonPosition: { x: number; y: number };
}

export function SettingsModal({ isOpen, onClose, settings, onSettingsChange, buttonPosition }: SettingsModalProps) {
    if (!isOpen) return null;

    const handleResetVisualSettings = () => {
        onSettingsChange({
            ...settings,
            visual: { 
                rotationSpeed: 0.001,
                showEffects: true 
            }
        });
    };

    const handleResetDisplaySettings = () => {
        onSettingsChange({
            ...settings,
            display: { 
                dateFormat: 'AC/DC',
                showNavbar: true,
                showFilters: true,
                showTimeline: true,
                showCameraButtons: true
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50" onClick={onClose}>
            <div
                className="absolute bg-black rounded-xl p-6 w-96 text-white border border-white/10 shadow-xl"
                style={{
                    top: buttonPosition.y,
                    left: buttonPosition.x,
                    transform: 'translate(-100%, -50%)',
                    animation: 'fadeIn 0.2s ease-out'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        Configuración
                    </h2>
                    <button
                        onClick={onClose}
                        className="hover:bg-white/10 rounded-full p-2 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Ajustes del mundo */}
                <section className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-300">Configuración visual del mundo</h3>
                        <button
                            onClick={handleResetVisualSettings}
                            className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
                        >
                            Default
                        </button>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm mb-2 text-gray-400">
                                Velocidad de Rotación
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="0.005"
                                    step="0.0001"
                                    value={settings.visual.rotationSpeed}
                                    onChange={(e) => onSettingsChange({
                                        ...settings,
                                        visual: { ...settings.visual, rotationSpeed: parseFloat(e.target.value) }
                                    })}
                                    className="w-full accent-blue-500"
                                />
                                <span className="text-sm text-gray-400 w-12">
                                    {settings.visual.rotationSpeed.toFixed(4)}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Ajustes de visualización */}
                <section className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-300">Elementos Visibles</h3>
                        <button
                            onClick={handleResetDisplaySettings}
                            className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
                        >
                            Default
                        </button>
                    </div>
                    <div className="space-y-4 bg-white/5 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="showNavbar"
                                checked={settings.display.showNavbar}
                                onChange={(e) => onSettingsChange({
                                    ...settings,
                                    display: { ...settings.display, showNavbar: e.target.checked }
                                })}
                                className="w-4 h-4 rounded accent-blue-500"
                            />
                            <label htmlFor="showNavbar" className="text-sm text-gray-300">
                                Barra de navegación
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="showFilters"
                                checked={settings.display.showFilters}
                                onChange={(e) => onSettingsChange({
                                    ...settings,
                                    display: { ...settings.display, showFilters: e.target.checked }
                                })}
                                className="w-4 h-4 rounded accent-blue-500"
                            />
                            <label htmlFor="showFilters" className="text-sm text-gray-300">
                                Panel de filtros
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="showTimeline"
                                checked={settings.display.showTimeline}
                                onChange={(e) => onSettingsChange({
                                    ...settings,
                                    display: { ...settings.display, showTimeline: e.target.checked }
                                })}
                                className="w-4 h-4 rounded accent-blue-500"
                            />
                            <label htmlFor="showTimeline" className="text-sm text-gray-300">
                                Línea de tiempo
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="showCameraButtons"
                                checked={settings.display.showCameraButtons}
                                onChange={(e) => onSettingsChange({
                                    ...settings,
                                    display: { ...settings.display, showCameraButtons: e.target.checked }
                                })}
                                className="w-4 h-4 rounded accent-blue-500"
                            />
                            <label htmlFor="showCameraButtons" className="text-sm text-gray-300">
                                Botones de cámara
                            </label>
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                            <span className="text-sm text-gray-300 mr-2">Formato de fechas:</span>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="dateFormat"
                                        checked={settings.display.dateFormat === 'AC/DC'}
                                        onChange={() => onSettingsChange({
                                            ...settings,
                                            display: { ...settings.display, dateFormat: 'AC/DC' }
                                        })}
                                        className="accent-blue-500"
                                    />
                                    <span className="text-sm text-gray-300">a.C./d.C.</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="dateFormat"
                                        checked={settings.display.dateFormat === 'BCE/CE'}
                                        onChange={() => onSettingsChange({
                                            ...settings,
                                            display: { ...settings.display, dateFormat: 'BCE/CE' }
                                        })}
                                        className="accent-blue-500"
                                    />
                                    <span className="text-sm text-gray-300">BCE/CE</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}