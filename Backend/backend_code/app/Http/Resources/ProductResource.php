<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ProductResource extends JsonResource
{
    /**
     * The "data" wrapper that should be applied.
     *
     * @var string|null
     */
    public static $wrap = 'product';

    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'stock' => $this->stock,
            'material' => $this->material->name,
            'color' => $this->color->name,
            'customisable' => $this->customisable,
            'image_path' => $this->image_path,
            'categories' => CategoryResource::collection($this->categories),
            $this->mergeWhen($request->product, [
                'business' => new BusinessResource($this->business),
                'review' => ReviewResource::collection($this->reviews),
            ])
        ];
    }
}
