import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
} from '@angular/fire/firestore';

export interface FeatureFlags {
  new_feature_enabled: boolean;
  [key: string]: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  // Valores por defecto (fallback si Firestore falla)
  private flags: FeatureFlags = {
    new_feature_enabled: false,
  };

  private loaded = false;

  constructor(private firestore: Firestore) { }

  /**
   * Carga todos los feature flags desde la colección "recipes" en Firestore.
   * Cada documento de la colección puede ser un flag diferente,
   * donde el ID del documento es el nombre del flag y el campo
   * "new_feature_enabled" contiene el valor booleano.
   *
   * Estructura Firestore:
   *   recipes/
   *     └── [cualquier doc id]
   *           └── new_feature_enabled: true | false
   */
  async loadFlags(): Promise<void> {
    try {
      const recipesCol = collection(this.firestore, 'recipes');
      const snapshot = await getDocs(recipesCol);

      snapshot.forEach((doc) => {
        const data = doc.data() as Record<string, boolean>;
        // Mezcla todos los campos de todos los documentos en el mapa de flags
        Object.assign(this.flags, data);
      });

      this.loaded = true;
      console.log('[FeatureFlagService] Flags cargados:', this.flags);
    } catch (error) {
      console.error('[FeatureFlagService] Error leyendo Firestore, usando defaults:', error);
      this.loaded = true; // Usar valores por defecto
    }
  }

  /**
   * Devuelve el valor del flag "new_feature_enabled".
   * Carga los flags si aún no se han cargado.
   */
  async isNewFeatureEnabled(): Promise<boolean> {
    if (!this.loaded) {
      await this.loadFlags();
    }
    return this.flags['new_feature_enabled'] ?? false;
  }

  /**
   * Método genérico para consultar cualquier flag por nombre.
   */
  async getFlag(flagName: string): Promise<boolean> {
    if (!this.loaded) {
      await this.loadFlags();
    }
    return this.flags[flagName] ?? false;
  }
}
