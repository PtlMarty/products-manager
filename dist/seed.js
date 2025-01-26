"use strict";
// seed.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("@/lib/db");
var saltAndHash_1 = require("@/lib/saltAndHash");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var user1, _a, _b, user2, _c, _d, shop1, shop2, supplier1, supplier2;
        var _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    console.log("Seeding database...");
                    _b = (_a = db_1.default.user).create;
                    _e = {};
                    _f = {
                        email: "user1@example.com",
                        name: "User One"
                    };
                    return [4 /*yield*/, (0, saltAndHash_1.saltAndHashPassword)("password1")];
                case 1: return [4 /*yield*/, _b.apply(_a, [(_e.data = (_f.password = _j.sent(),
                            _f),
                            _e)])];
                case 2:
                    user1 = _j.sent();
                    _d = (_c = db_1.default.user).create;
                    _g = {};
                    _h = {
                        email: "user2@example.com",
                        name: "User Two"
                    };
                    return [4 /*yield*/, (0, saltAndHash_1.saltAndHashPassword)("password2")];
                case 3: return [4 /*yield*/, _d.apply(_c, [(_g.data = (_h.password = _j.sent(),
                            _h),
                            _g)])];
                case 4:
                    user2 = _j.sent();
                    return [4 /*yield*/, db_1.default.shop.create({
                            data: {
                                name: "Shop One",
                            },
                        })];
                case 5:
                    shop1 = _j.sent();
                    return [4 /*yield*/, db_1.default.shop.create({
                            data: {
                                name: "Shop Two",
                            },
                        })];
                case 6:
                    shop2 = _j.sent();
                    // Link users and shops (ShopUser)
                    return [4 /*yield*/, db_1.default.shopUser.createMany({
                            data: [
                                { shopId: shop1.id, userId: user1.id, role: "Owner" },
                                { shopId: shop1.id, userId: user2.id, role: "Manager" },
                                { shopId: shop2.id, userId: user2.id, role: "Owner" },
                            ],
                        })];
                case 7:
                    // Link users and shops (ShopUser)
                    _j.sent();
                    return [4 /*yield*/, db_1.default.supplier.create({
                            data: {
                                name: "Supplier One",
                            },
                        })];
                case 8:
                    supplier1 = _j.sent();
                    return [4 /*yield*/, db_1.default.supplier.create({
                            data: {
                                name: "Supplier Two",
                            },
                        })];
                case 9:
                    supplier2 = _j.sent();
                    // Create products for Shop One
                    return [4 /*yield*/, db_1.default.product.createMany({
                            data: [
                                {
                                    name: "Product 1 for Shop One",
                                    price: 1000, // In cents (for example, $10.00)
                                    shopId: shop1.id,
                                    supplierId: supplier1.id,
                                },
                                {
                                    name: "Product 2 for Shop One",
                                    price: 1500, // $15.00
                                    shopId: shop1.id,
                                    supplierId: supplier2.id,
                                },
                            ],
                        })];
                case 10:
                    // Create products for Shop One
                    _j.sent();
                    // Create products for Shop Two
                    return [4 /*yield*/, db_1.default.product.createMany({
                            data: [
                                {
                                    name: "Product 1 for Shop Two",
                                    price: 2000, // $20.00
                                    shopId: shop2.id,
                                    supplierId: supplier1.id,
                                },
                            ],
                        })];
                case 11:
                    // Create products for Shop Two
                    _j.sent();
                    console.log("Seeding completed successfully.");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (error) {
    console.error("Seeding error:", error);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.default.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
