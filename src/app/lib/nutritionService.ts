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
    // Certifique-se de que os dados estão em um formato que pode ser salvo no Firestore
    const nutritionHistory = {
      ...nutrition,
      userId,
      createdAt: Timestamp.now(),
      // Garanta que todas as propriedades são serializáveis
      meals: nutrition.meals.map(meal => ({
        name: meal.name || "",
        time: meal.time || "",
        foods: Array.isArray(meal.foods) ? meal.foods : []
      })),
      supplements: Array.isArray(nutrition.supplements) ? nutrition.supplements : []
    };
    
    console.log("Salvando no Firebase:", JSON.stringify(nutritionHistory));
    
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
    console.log("Searching for nutrition history with userId:", userId);
    
    const q = query(
      collection(db, 'nutritionHistory'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    console.log(`Found ${querySnapshot.size} documents in nutritionHistory`);
    
    const nutritionHistory: NutritionHistory[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      nutritionHistory.push({
        ...data,
        id: doc.id,
        // Mantemos o Timestamp como está para manipulação no lado do cliente
        createdAt: data.createdAt
      } as NutritionHistory);
    });
    
    return nutritionHistory;
  } catch (error) {
    console.error('Error getting nutrition history:', error);
    throw new Error('Failed to get nutrition history');
  }
}

// Excluir uma dieta do histórico
export async function deleteNutritionHistory(nutritionId: string): Promise<void> {
  try {
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

// Debug function to get all nutrition history
export async function getAllNutritionHistory(): Promise<NutritionHistory[]> {
  try {
    console.log("Getting all nutrition history for debugging");
    
    const q = query(
      collection(db, 'nutritionHistory'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    console.log(`Found ${querySnapshot.size} total documents in nutritionHistory`);
    
    const nutritionHistory: NutritionHistory[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`Document ID: ${doc.id}, userId: ${data.userId}`);
      
      nutritionHistory.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt
      } as NutritionHistory);
    });
    
    return nutritionHistory;
  } catch (error) {
    console.error('Error getting all nutrition history:', error);
    throw new Error('Failed to get all nutrition history');
  }
} 