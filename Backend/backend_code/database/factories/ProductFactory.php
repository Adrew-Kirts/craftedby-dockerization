<?php

namespace Database\Factories;

use App\Models\Product;
use Faker\Factory as Faker;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faker = Faker::create('fr_FR');
        // Generate the image and store the path
        $imageFullPath = $faker->image('public/images/products', 640, 480, null, false, true, 'Artisanal Product', false);

        // Remove the 'public/' part from the path
        $imagePath = str_replace('public/', '', $imageFullPath);
        return [
            'name' => $faker->word,
            'description' => $faker->sentence,
            'price' => $faker->numberBetween(10, 450),
            'stock' => $faker->numberBetween(1, 25),
            'size' => $faker->randomElement(['S', 'M', 'L']),
            'weight' => $faker->numberBetween(1, 20),
            'customisable' => $faker->boolean(20),
//            'image_path' => $faker->image('public/images/products', 640, 480, null, '/images/products/', null, 'Artisanal Product', null),
            'image_path' => $imagePath,
        ];
    }
}
