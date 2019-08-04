<?php

require __DIR__ . '/cunli_codes.php';

$cunliCodes = $code2name = array();
$fh = fopen(dirname(__DIR__) . '/data.tainan/cunli_code.csv', 'r');
while ($line = fgetcsv($fh, 2048)) {
    $cunliCodes[$line[1] . $line[3] . $line[5]] = $line[4];
    $code2name[$line[4]] = $line[1] . $line[3] . $line[5];
}
fclose($fh);

$fh = fopen(__DIR__ . '/data10407M030.csv', 'r');
fgetcsv($fh, 2048);
fgetcsv($fh, 2048);

$dengue = json_decode(file_get_contents(dirname(__DIR__) . '/taiwan/Dengue.json'), true);
$cunliRateFh = fopen(__DIR__ . '/cunli_rate.csv', 'w');
fputcsv($cunliRateFh, array(
    '村里代碼',
    '村里',
    '人口數',
    '病例數',
    '發生率',
));

while ($line = fgetcsv($fh, 2048)) {
    $key = $line[1] . $line[2];
    $md5 = md5($key);
    if (!isset($cunliCodes[$key])) {
        $replacedKey = strtr($key, array(
            '臺北市' => '台北市',
            ' ' => '',
            '臺中市' => '台中市',
            '臺南市' => '台南市',
            '三民一' => '三民區',
            '三民二' => '三民區',
            '鳳山一' => '鳳山區',
            '鳳山二' => '鳳山區',
        ));
        if (!isset($cunliCodes[$replacedKey])) {
            if (!isset($missingCodes[$md5])) {
                echo $key . "\n";
                echo md5($key) . "\n";
                $prefix = mb_substr($key, 0, 6, 'utf-8');
                foreach ($cunliCodes AS $cunliKey => $code) {
                    if (false !== strpos($cunliKey, $prefix)) {
                        echo "{$cunliKey} => {$code}\n";
                    }
                }
                $prefix = mb_substr($replacedKey, 0, 6, 'utf-8');
                foreach ($cunliCodes AS $cunliKey => $code) {
                    if (false !== strpos($cunliKey, $prefix)) {
                        echo "{$cunliKey} => {$code}\n";
                    }
                }
                exit();
            } else {
                $cunliCode = $missingCodes[$md5];
            }
        } else {
            $cunliCode = $cunliCodes[$replacedKey];
        }
    } else {
        $cunliCode = $cunliCodes[$key];
    }
    if (isset($dengue[$cunliCode])) {
        $line[4] = intval($line[4]);
        $sum = 0;
        foreach ($dengue[$cunliCode] AS $day) {
            $sum += $day[1];
        }

        fputcsv($cunliRateFh, array(
            $cunliCode,
            $code2name[$cunliCode],
            $line[4],
            $sum,
            round($sum / $line[4], 6),
        ));
    }
}
fclose($fh);
