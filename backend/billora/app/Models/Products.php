<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Products extends Model
{
    use HasFactory,SoftDeletes;

    protected $table = 'products';
    
    protected $fillable=[
        'user_id',
        'sku',
        'name',
        'brand_id',
        'category_id',
        'unit_amount',
        'unit_id',	
        'selling_price',
        'purchase_price',
        'gst_percentage',
        'discount_percentage',
        'description',
        'is_active',
        'created_by',
        'image',
        'qr_code',
        'slug',  //new columns
        'conversion_factor',
        'minimum_stock_quantity',
        'maximum_stock_quantity',
        'current_stock',
        'mrp',
        'wholesale_price',
        'gst_hsn_code',
        'discount_amount',
        'cess_percentage',
        'attributes',
        'medicine_type_id',
        // 'other_medicine_type',
        'expiry_date',
        'batch_number',
        'manufacturer_name',
        'prescription_required',
        'schedule_type',
        'salt_composition',
        'perishable',
        'organic_certified',
        'harvest_date',
        'storage_instructions',
        'short_description',
        'barcode',
        'is_featured',
        'is_returnable',
        'is_refundable',
        'warranty_months',
        'warehouse_location',
        'supplier_id',
        'updated_by',
        'image_public_id',
        'qr_public_id',
        'barcode_public_id'

    ];
    protected $casts = [
    'attributes' => 'array',
];

    public function images(): HasMany
    {
        return $this->hasMany(ProductImages::class, 'product_id');
    }
    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class, 'product_id');
    }
    public function brand(){
        return $this->belongsTo(Brand::class);
    }
    public function category(){
        return $this->belongsTo(Categories::class);
    }
    public function unit(){
        return $this->belongsTo(Unit::class);
    }
    public function user(){
        return $this->belongsTo(Customers::class);
    }
    public function stocks(): HasMany
    {
        return $this->hasMany( Stocks::class, 'product_id');
    }
    public function medicine_type(){
        return $this->belongsTo(MedicineType::class,'medicine_type_id');
    }
}
