import { Shape } from '@/models/shape.model';
import { create } from 'zustand';

type ShapeState = {
    fromShapes: Shape[] | null;
    toShapes: Shape[] | null;
    setFromShapes: (shapes: Shape[]) => void;
    setToShapes: (shapes: Shape[]) => void;
    clearShapes: () => void;
}

export const useShapeStore = create<ShapeState>((set) => ({
    fromShapes: null,
    toShapes: null,
    setFromShapes: (shapes) => set({fromShapes: shapes}),
    setToShapes: (shapes) => set({toShapes: shapes}),
    clearShapes: () => set({fromShapes: null, toShapes: null})
}));