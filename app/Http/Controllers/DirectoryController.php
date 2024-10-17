<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Phenophase;
use App\Models\Operation;
use App\Models\AgroOperation;
use App\Models\Meteodata;
use App\Models\DateRange;
use App\Models\ClimaticParametre;
use App\Models\Plotdata;
use App\Models\Sort;
use App\Models\Sick;
use App\Models\People;
use App\Models\FuncNeed;
use App\Models\GreenDefend;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DirectoryController extends Controller
{

    // Пример массива конфигурации таблиц
    protected $tablesConfig = [
        'phenophases' => [
            'mapping' => [
                'ID' => 'id',
                'Наименование' => 'name',
                'Месяц' => 'month', // Замените на правильный ключ
                'Продолжительность' => 'duration', // Замените на правильный ключ
                'Описание' => 'description',
                'Агротехнические операции' => 'agrotechnical_operations',
                'Действия' => 'actions'
            ]
        ],
        'agro_operations' => [
            'mapping' => [
                'ID' => 'id',
                'Наименование' => 'name',
                'Вид' => 'type',
                'Сроки' => 'month',
                'Описание' => 'description',
                'Действия' => 'actions'
            ]
        ],
        'meteodatas' => [
            'mapping' => [
                'ID' => 'id',
                'Дата обновления' => 'date',
                'Батарея' => 'battery',
                'Солнечная активность' => 'sun_activity',
                'min t°' => 'min_t',
                'max t°' => 'max_t',
                'avg t°' => 'avg_t',
                'Относительная влажность' => 'humidity',
                'Влажность листа' => 'humidity_letter',
                'Почва t°' => 'ground_t',
                'Действия' => 'actions'
            ]
        ],
        'climatic_parametres' => [
            'mapping' => [
                'ID' => 'id',
                'Сумма температур, 10 ℃' => 'sum_t_ten',
                'Сумма температур, 20 ℃' => 'sum_t_twenty',
                'Хуглина Индекс' => 'ind_hug',
                'Уинклера Индекс' => 'ind_uink',
                'Средняя температура в сентября, ℃' => 'avg_t_spt',
                'Средняя температура за вегетационный период, ℃' => 'avg_t_veget',
                'ГТК' => 'gtk',
                'Годовое количество осадков, мм' => 'ann_precip',
                'Количество осадков за вегетационный период, мм' => 'precip',
                'Количество осадков в сентябре, мм' => 'spt_precip',
                'Действия' => 'actions'
            ]
        ],
        'plotdatas' => [
            'mapping' => [
                'ID' => 'id',
                'Владелец' => 'host',
                'Номер участка' => 'plot_num',
                'Географические координаты' => 'coords',
                'Площадь' => 'square',
                'Ряды кол-во' => 'rows_num',
                'Год и месяц посадки' => 'year_mon',
                'Сорт' => 'sort',
                'Подвой/привой' => 'rootstock',
                'Схема посадки' => 'schema',
                'Кол-во кустов' => 'bush_num',
                'Способ посадки' => 'ways',
                'Способ орошения' => 'ways_orosh',
                'Шпалера' => 'shpalera',
                'Действия' => 'actions'
            ]
        ],
        'sorts' => [
            'mapping' => [
                'ID' => 'id',
                'Название' => 'name',
                'Описание' => 'description',
                'Фото ягод' => 'photo_berry',
                'Фото листа' => 'photo_piece',
                'Хар-ки' => 'parametres',
                'Сроки созревания' => 'time_to_grow',
                'Сахаристость' => 'sugar',
                'Кислотность' => 'toxic',
                'Коэфф-т плодоносности' => 'koef_baby',
                'Нагрузка куста' => 'bush_u',
                'Урожайность' => 'babywork',
                'Устойчивость к болезням' => 'stable_sick',
                'Устойчивость к засухе' => 'stable_thirst',
                'Морозоустойчивость' => 'stable_froze',
                'Действия' => 'actions'
            ]
        ],
        'sicks' => [
            'mapping' => [
                'ID' => 'id',
                'Наименование' => 'name',
                'Возбудитель' => 'pathogen',
                'Вредоносность' => 'severity',
                'Симптомы' => 'symptoms',
                'Фото' => 'photo_url',
                'Биология патогена' => 'biology',
                'Защитные мероприятия' => 'shield',
                'Действия' => 'actions'
            ]
        ],
        'people' => [
            'mapping' => [
                'ID' => 'id',
                'ФИО' => 'name',
                'Функциональные обязанности' => 'func_needs',
                'Телефон' => 'phone',
                'Комментарии' => 'comments',
                'Действия' => 'actions'
            ]
        ],
        'func_needs' => [
            'mapping' => [
                'ID' => 'id',
                'ФИО' => 'name',
                'Функциональные обязанности' => 'func_needs',
                'Действия' => 'actions'
            ]
        ],
        'green_defends' => [
            'mapping' => [
                'ID' => 'id',
                'Фазы развития' => 'phases',
                'Период' => 'month',
                'Обработка от болезней' => 'processing',
                'Количество операций' => 'number_operations',
                'Действия' => 'actions'
            ]
        ],
    ];

    protected $models = [
        'phenophases' => Phenophase::class,
        'agro_operations' => AgroOperation::class,
        'meteodatas' => Meteodata::class,
        'climatic_parametres' => ClimaticParametre::class,
        'plotdatas' => Plotdata::class,
        'sorts' => Sort::class,
        'sicks' => Sick::class,
        'people' => People::class,
        'func_needs' => FuncNeed::class,
        'green_defends' => GreenDefend::class,
    ];

    // Страница справочников
    public function directory()
    {
        return view('directory.directory');
    }

    public function getAllRows($tableName)
    {

        $tableConfig = $this->tablesConfig[$tableName] ?? abort(404, 'Таблица не найдена');
        $headerMapping = $tableConfig['mapping'];
    
        if (Schema::hasTable($tableName) && isset($this->models[$tableName])) {
            // Получаем модель для данной таблицы
            $modelClass = $this->models[$tableName];
            
            $tableHeads = array_keys($headerMapping);

            $modelInstance = new $modelClass;
            
            // Загружаем строки с операциями, если они есть
            if (method_exists($modelInstance, 'operations') && $modelInstance->operations() instanceof \Illuminate\Database\Eloquent\Relations\MorphMany) {
                // Загружаем строки с операциями, если они связаны с моделью
                $rows = $modelClass::with('operations')->get();
            } else {
                // Если связи 'operations' нет, просто загружаем строки
                $rows = $modelClass::all();
            }
            return response()->json([
                'rows' => $rows,
                'tableHeads' => $tableHeads,
                'headerMapping' => $headerMapping,
            ]);
        } else {
            return response()->json(['error' => 'Таблица или модель не найдены'], 404);
        }
    }


    public function createRow($tableName)
    {
        // Проверяем наличие конфигурации для таблицы
        $tableConfig = $this->tablesConfig[$tableName] ?? abort(404, 'Таблица не найдена');

        // Проверяем наличие таблицы в базе данных
        if (Schema::hasTable($tableName)) {
            // Получаем список столбцов таблицы
            $columns = Schema::getColumnListing($tableName);

            // Создаем массив с дефолтными значениями для всех столбцов
            $newRowData = [];
            foreach ($columns as $column) {
                if ($column != 'id') {
                    // Получаем тип данных столбца
                    $columnType = Schema::getColumnType($tableName, $column);

                    // Определяем значение по умолчанию в зависимости от типа данных
                    switch ($columnType) {
                        case 'integer':
                        case 'bigint':
                        case 'float':
                        case 'double':
                        case 'decimal':
                            $newRowData[$column] = 0; // Для числовых полей по умолчанию 0
                            break;
                        case 'boolean':
                            $newRowData[$column] = false; // Для булевых полей false
                            break;
                        case 'string':
                        case 'text':
                            $newRowData[$column] = ''; // Для строковых полей пустая строка
                            break;
                        case 'date':
                        case 'datetime':
                        case 'timestamp':
                            $newRowData[$column] = now(); // Для даты вставляем текущую дату
                            break;
                        case 'enum':
                            $newRowData[$column] = 'Зеленые';
                            break;
                        default:
                            $newRowData[$column] = null; // По умолчанию null для остальных типов
                            break;
                    }
                }
            }

            // Вставляем новую строку и получаем её ID
            $newRowId = DB::table($tableName)->insertGetId($newRowData);

            // Добавляем ID в массив данных строки
            $newRowData['id'] = $newRowId;

            // Возвращаем новую строку и заголовки таблицы
            return response()->json([
                'row' => $newRowData,
                'tableHeads' => $tableConfig['mapping']  // Возвращаем заголовки
            ]);
        } else {
            // Если таблица не найдена
            return response()->json(['error' => 'Таблица не найдена'], 404);
        }
    }


    public function deleteRow(Request $request, $tableName, $rowId)
    {
        if (Schema::hasTable($tableName)) {
            $deleted = DB::table($tableName)->where('id', $rowId)->delete();

            if ($deleted) {
                return response()->json(['success' => true]);
            } else {
                return response()->json(['error' => 'Ошибка при удалении записи'], 500);
            }
        } else {
            return response()->json(['error' => 'Таблица не найдена'], 404);
        }
    }

    public function updateRow(Request $request, $tableName, $id)
    {
        if (Schema::hasTable($tableName)) {
            $columns = Schema::getColumnListing($tableName);

            // Фильтруем входные данные запроса, оставляя только те, которые соответствуют колонкам таблицы
            $data = $request->only($columns);

            DB::table($tableName)->where('id', $id)->update($data);

            return response()->json(['success' => true]);
        } else {
            return response()->json(['error' => 'Таблица не найдена'], 404);
        }
    }

    public function getOperations($table, $rowId)
    {
        if (Schema::hasTable($table)) {
            // Проверяем, есть ли модель для данной таблицы
            if (isset($this->models[$table])) {
                $rowType = $this->models[$table]; // Используем глобальную переменную

                // Получаем операции с учетом row_type
                $operations = Operation::where('row_id', $rowId)
                    ->where('table_name', $table)
                    ->where('row_type', $rowType)
                    ->get();

                return response()->json(['operations' => $operations]);
            } else {
                return response()->json(['error' => 'Модель для таблицы не найдена'], 404);
            }
        } else {
            return response()->json(['error' => 'Таблица не найдена'], 404);
        }
    }

    public function addOperation(Request $request, $table, $rowId)
    {
        // Проверяем, существует ли таблица
        if (Schema::hasTable($table)) {
            // Проверяем, есть ли модель для данной таблицы
            if (isset($this->models[$table])) {
                $rowType = $this->models[$table];

                // Создаем операцию с указанием row_type
                Operation::create([
                    'row_id' => $rowId,
                    'row_type' => $rowType,
                    'table_name' => $table,
                    'name' => $request->input('name')
                ]);

                // Получаем обновленный список операций
                $operations = Operation::where('row_id', $rowId)
                    ->where('table_name', $table)
                    ->get();

                return response()->json(['success' => true, 'operations' => $operations]);
            } else {
                return response()->json(['error' => 'Модель для таблицы не найдена'], 404);
            }
        } else {
            return response()->json(['error' => 'Таблица не найдена'], 404);
        }
    }

    public function deleteOperation($table, $rowId, $operationId)
    {
        if (Schema::hasTable($table)) {
            Operation::where('id', $operationId)
                ->where('table_name', $table)
                ->delete();
            $operations = Operation::where('row_id', $rowId)
                ->where('table_name', $table)
                ->get();
            return response()->json(['success' => true, 'operations' => $operations]);
        } else {
            return response()->json(['error' => 'Таблица не найдена'], 404);
        }
    }

    public function getDateRanges($table, $rowId)
    {
        $dateRanges = DateRange::where('table_name', $table)
                                ->where('row_id', $rowId)
                                ->get();
        return response()->json($dateRanges);
    }

    // Сохранение нового диапазона дат
    public function setDateRange(Request $request, $table, $rowId)
    {
        $dateRange = new DateRange();
        $dateRange->table_name = $table;
        $dateRange->row_id = $rowId;
        $dateRange->start_date = $request->start_date;
        $dateRange->end_date = $request->end_date;
        $dateRange->save();

        if (Schema::hasTable($table) && Schema::hasColumn($table, 'duration')) {
            $this->calculateTotalDuration($table, $rowId);
        }

        return response()->json(['message' => 'Диапазон дат сохранён']);
    }

    // Удаление диапазона дат
    public function removeDateRange($table, $rowId, $rangeId)
    {
        $dateRange = DateRange::where('id', $rangeId)
                              ->where('table_name', $table)
                              ->where('row_id', $rowId)
                              ->first();

        if ($dateRange) {
            $dateRange->delete();

            if (Schema::hasTable($table) && Schema::hasColumn($table, 'duration')) {
                $this->calculateTotalDuration($table, $rowId);
            }

            return response()->json(['message' => 'Диапазон дат удалён']);
        }

        return response()->json(['message' => 'Диапазон не найден'], 404);
    }

    public function calculateTotalDuration($table, $rowId)
    {
        $dateRanges = DateRange::where('table_name', $table)
                                ->where('row_id', $rowId)
                                ->get();

        $totalDuration = 0;

        foreach ($dateRanges as $range) {
            $startDate = Carbon::parse($range->start_date);
            $endDate = Carbon::parse($range->end_date);
            $duration = $startDate->diffInDays($endDate) + 1; // +1 чтобы включить оба дня в расчёт
            $totalDuration += $duration;
        }

        // Сохранить продолжительность в основной таблице
        DB::table($table)->where('id', $rowId)->update(['duration' => $totalDuration]);

        return $totalDuration;
    }

    public function uploadPhoto(Request $request, $table, $rowId)
    {
        $column = $request->input('column');

        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('photos', 'public');

            DB::table($table)->where('id', $rowId)->update([$column => $photoPath]);

            return response()->json([
                'success' => true,
            ]);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }

    public function deletePhoto(Request $request, $table, $rowId)
    {
        $column = $request->input('column');

        $row = DB::table($table)->where('id', $rowId)->first();
    
        // Проверяем, существует ли нужный столбец
        if (!property_exists($row, $column)) {
            return response()->json(['error' => 'Column not found'], 404);
        }
        
        $photoPath = $row->{$column};

        if ($photoPath) {
            Storage::disk('public')->delete($photoPath);
            DB::table($table)->where('id', $rowId)->update([$column => null]);

            return response()->json(['success' => true]);
        }

        return response()->json(['error' => 'Photo not found'], 404);
    }

}
