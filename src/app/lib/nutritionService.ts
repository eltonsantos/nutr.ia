import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  deleteDoc,
  doc,
  getDoc
} from 'firebase/firestore';

export interface NutritionData {
  name: string;
  height: string;
  weight: string;
  age: string;
  gender: string;
  objective: string;
  activityLevel: string;
  meals: { name: string; time: string; foods: string[] }[];
  supplements: string[];
}

export interface NutritionHistory extends NutritionData {
  id?: string;
  userId: string;
  createdAt: { toDate?: () => Date } | Date;
}

// Salvar uma nova dieta no histórico
export async function saveNutritionToHistory(nutrition: NutritionData, userId: string): Promise<string> {
  try {
    const nutritionHistory = {
      ...nutrition,
      userId,
      createdAt: Timestamp.now(),
      meals: nutrition.meals.map(meal => ({
        name: meal.name || "",
        time: meal.time || "",
        foods: Array.isArray(meal.foods) ? meal.foods : []
      })),
      supplements: Array.isArray(nutrition.supplements) ? nutrition.supplements : []
    };
    
    const docRef = await addDoc(collection(db, 'nutritionHistory'), nutritionHistory);
    return docRef.id;
  } catch (error) {
    console.error('Error saving nutrition history:', error);
    throw new Error('Failed to save nutrition history');
  }
}

// Obter o histórico de dietas de um usuário
export async function getNutritionHistory(userId: string): Promise<NutritionHistory[]> {
  try {
    const q = query(
      collection(db, 'nutritionHistory'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    const nutritionHistory: NutritionHistory[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      nutritionHistory.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt
      } as NutritionHistory);
    });
    
    nutritionHistory.sort((a, b) => {
      const dateA = a.createdAt && typeof a.createdAt === 'object' && 'toDate' in a.createdAt 
        ? a.createdAt.toDate!().getTime() 
        : new Date(a.createdAt as Date).getTime();
      const dateB = b.createdAt && typeof b.createdAt === 'object' && 'toDate' in b.createdAt 
        ? b.createdAt.toDate!().getTime() 
        : new Date(b.createdAt as Date).getTime();
      return dateB - dateA;
    });
    
    return nutritionHistory;
  } catch (error) {
    console.error('Error getting nutrition history:', error);
    throw new Error('Failed to get nutrition history');
  }
}

// Excluir uma dieta do histórico
export async function deleteNutritionHistory(nutritionId: string, userId?: string): Promise<void> {
  try {
    if (userId) {
      const nutritionDoc = await getNutritionById(nutritionId);
      if (!nutritionDoc) {
        throw new Error('Nutrition record not found');
      }
      if (nutritionDoc.userId !== userId) {
        throw new Error('Unauthorized: You can only delete your own nutrition records');
      }
    }
    
    await deleteDoc(doc(db, 'nutritionHistory', nutritionId));
  } catch (error) {
    console.error('Error deleting nutrition history:', error);
    throw new Error('Failed to delete nutrition history');
  }
}

// Obter uma dieta específica do histórico
export async function getNutritionById(nutritionId: string): Promise<NutritionHistory | null> {
  try {
    const docRef = doc(db, 'nutritionHistory', nutritionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt
      } as NutritionHistory;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting nutrition by ID:', error);
    throw new Error('Failed to get nutrition by ID');
  }
} 