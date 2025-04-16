import { 
  AgeRange, 
  BreedSize, 
  DietaryIndicator 
} from "../types/foodTypes";
import { 
  getFoodsByBrand,
  getFoodsByAgeRange,
  getFoodsByBreedSize,
  getFoodsByDietaryIndicator,
  getFoodsByIngredient,
  getFoodsByNutritionalRange,
  getRecommendedFoods,
  runFoodDatabaseDemo
} from "./foodDatabaseUtils";

describe("Food Database Utility Functions", () => {
  describe("getFoodsByBrand", () => {
    it("returns products for a valid brand", () => {
      const foods = getFoodsByBrand("Premium Paws");
      expect(foods.length).toBeGreaterThan(0);
      expect(foods[0].brandId).toBe("b1");
    });

    it("throws an error for empty brand name", () => {
      expect(() => getFoodsByBrand("")).toThrow("Brand name cannot be empty");
    });

    it("throws an error for non-existent brand", () => {
      expect(() => getFoodsByBrand("NonExistentBrand")).toThrow('Brand "NonExistentBrand" not found');
    });
  });

  describe("getFoodsByAgeRange", () => {
    it("returns foods for puppy age range", () => {
      const foods = getFoodsByAgeRange(AgeRange.PUPPY);
      expect(foods.length).toBeGreaterThan(0);
      foods.forEach(food => {
        expect(food.suitableAges).toContain(AgeRange.PUPPY);
      });
    });

    it("returns foods for adult age range", () => {
      const foods = getFoodsByAgeRange(AgeRange.ADULT);
      expect(foods.length).toBeGreaterThan(0);
      foods.forEach(food => {
        expect(food.suitableAges).toContain(AgeRange.ADULT);
      });
    });

    it("returns foods for senior age range", () => {
      const foods = getFoodsByAgeRange(AgeRange.SENIOR);
      expect(foods.length).toBeGreaterThan(0);
      foods.forEach(food => {
        expect(food.suitableAges).toContain(AgeRange.SENIOR);
      });
    });

    it("throws an error for invalid age range", () => {
      // @ts-ignore - Testing invalid input
      expect(() => getFoodsByAgeRange("invalid")).toThrow("Invalid age range: invalid");
    });
  });

  describe("getFoodsByBreedSize", () => {
    it("returns foods for small breed size", () => {
      const foods = getFoodsByBreedSize(BreedSize.SMALL);
      expect(foods.length).toBeGreaterThan(0);
      foods.forEach(food => {
        expect(food.suitableBreedSizes).toContain(BreedSize.SMALL);
      });
    });

    it("returns foods for medium breed size", () => {
      const foods = getFoodsByBreedSize(BreedSize.MEDIUM);
      expect(foods.length).toBeGreaterThan(0);
      foods.forEach(food => {
        expect(food.suitableBreedSizes).toContain(BreedSize.MEDIUM);
      });
    });

    it("returns foods for large breed size", () => {
      const foods = getFoodsByBreedSize(BreedSize.LARGE);
      expect(foods.length).toBeGreaterThan(0);
      foods.forEach(food => {
        expect(food.suitableBreedSizes).toContain(BreedSize.LARGE);
      });
    });

    it("throws an error for invalid breed size", () => {
      // @ts-ignore - Testing invalid input
      expect(() => getFoodsByBreedSize("invalid")).toThrow("Invalid breed size: invalid");
    });
  });

  describe("getFoodsByDietaryIndicator", () => {
    it("returns foods with grain-free dietary indicator", () => {
      const foods = getFoodsByDietaryIndicator(DietaryIndicator.GRAIN_FREE);
      expect(foods.length).toBeGreaterThan(0);
      foods.forEach(food => {
        expect(food.dietaryIndicators).toContain(DietaryIndicator.GRAIN_FREE);
      });
    });

    it("returns foods with limited-ingredient dietary indicator", () => {
      const foods = getFoodsByDietaryIndicator(DietaryIndicator.LIMITED_INGREDIENT);
      expect(foods.length).toBeGreaterThan(0);
      foods.forEach(food => {
        expect(food.dietaryIndicators).toContain(DietaryIndicator.LIMITED_INGREDIENT);
      });
    });

    it("throws an error for invalid dietary indicator", () => {
      // @ts-ignore - Testing invalid input
      expect(() => getFoodsByDietaryIndicator("invalid")).toThrow("Invalid dietary indicator: invalid");
    });
  });

  describe("getFoodsByIngredient", () => {
    it("returns foods that include chicken", () => {
      const foods = getFoodsByIngredient("Chicken", "include");
      expect(foods.length).toBeGreaterThan(0);
      foods.forEach(food => {
        const hasChicken = food.ingredients.some(
          ing => ing.name.toLowerCase().includes("chicken")
        );
        expect(hasChicken).toBe(true);
      });
    });

    it("returns foods that exclude chicken", () => {
      const foods = getFoodsByIngredient("Chicken", "exclude");
      foods.forEach(food => {
        const hasChicken = food.ingredients.some(
          ing => ing.name.toLowerCase().includes("chicken")
        );
        expect(hasChicken).toBe(false);
      });
    });

    it("throws an error for empty ingredient", () => {
      expect(() => getFoodsByIngredient("", "include")).toThrow("Ingredient name cannot be empty");
    });
  });

  describe("getFoodsByNutritionalRange", () => {
    it("returns foods with protein in the specified range", () => {
      const min = 25;
      const max = 35;
      const foods = getFoodsByNutritionalRange("protein", min, max);
      expect(foods.length).toBeGreaterThan(0);
      foods.forEach(food => {
        expect(food.nutritionalValue.protein).toBeGreaterThanOrEqual(min);
        expect(food.nutritionalValue.protein).toBeLessThanOrEqual(max);
      });
    });

    it("throws an error for invalid nutrient", () => {
      expect(() => getFoodsByNutritionalRange("invalid", 0, 100)).toThrow("Invalid nutrient");
    });

    it("throws an error for negative values", () => {
      expect(() => getFoodsByNutritionalRange("protein", -1, 30)).toThrow("Nutritional values cannot be negative");
    });

    it("throws an error when min is greater than max", () => {
      expect(() => getFoodsByNutritionalRange("protein", 40, 30)).toThrow("Minimum value cannot be greater than maximum value");
    });
  });

  describe("getRecommendedFoods", () => {
    it("returns recommended foods for a puppy", () => {
      const foods = getRecommendedFoods(0.5, BreedSize.MEDIUM);
      expect(foods.length).toBeGreaterThan(0);
      // Check the first food contains puppy age range and medium breed size
      expect(foods[0].suitableAges).toContain(AgeRange.PUPPY);
      expect(foods[0].suitableBreedSizes).toContain(BreedSize.MEDIUM);
    });

    it("returns recommended foods with dietary restrictions", () => {
      const foods = getRecommendedFoods(
        0.5, 
        BreedSize.MEDIUM, 
        [DietaryIndicator.GRAIN_FREE]
      );
      expect(foods.length).toBeGreaterThan(0);
      // Check the first food contains puppy age range, medium breed size, and is grain-free
      expect(foods[0].suitableAges).toContain(AgeRange.PUPPY);
      expect(foods[0].suitableBreedSizes).toContain(BreedSize.MEDIUM);
      expect(foods[0].dietaryIndicators).toContain(DietaryIndicator.GRAIN_FREE);
    });

    it("throws an error for negative age", () => {
      expect(() => getRecommendedFoods(-1, BreedSize.MEDIUM)).toThrow("Dog age cannot be negative");
    });

    it("throws an error for invalid breed size", () => {
      // @ts-ignore - Testing invalid input
      expect(() => getRecommendedFoods(2, "invalid")).toThrow("Invalid breed size");
    });

    it("throws an error for invalid dietary indicator", () => {
      // @ts-ignore - Testing invalid input
      expect(() => getRecommendedFoods(2, BreedSize.MEDIUM, ["invalid"])).toThrow("Invalid dietary indicator");
    });
  });

  describe("runFoodDatabaseDemo", () => {
    it("returns a string with demo results", () => {
      const result = runFoodDatabaseDemo();
      expect(typeof result).toBe("string");
      expect(result).toContain("Food Database Demo Results");
    });
  });
}); 