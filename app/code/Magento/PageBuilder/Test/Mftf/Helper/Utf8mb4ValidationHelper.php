<?php
/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Test\Mftf\Helper;

use Magento\FunctionalTestingFramework\Helper\Helper;
use PDO;
use PHPUnit\Framework\SkippedWithMessageException;

class Utf8mb4ValidationHelper extends Helper
{
    /**
     * Skip the current test when the target storage is not utf8mb4-safe.
     *
     * @param string $table
     * @param string $column
     * @return void
     */
    public function skipIfUtf8mb4Unsupported(string $table, string $column): void
    {
        if (!$this->isColumnSupported($table, $column)) {
            throw new SkippedWithMessageException(
                sprintf('Skipping utf8mb4 positive path because %s.%s is not utf8mb4-safe.', $table, $column)
            );
        }
    }

    /**
     * Check whether the target storage can safely persist utf8mb4 characters.
     *
     * @param string $table
     * @param string $column
     * @return bool
     */
    private function isColumnSupported(string $table, string $column): bool
    {
        $connection = $this->createConnection();

        if ($connection === null) {
            return false;
        }

        $connectionData = $connection->query(
            'SELECT @@character_set_connection AS charset, @@collation_connection AS collation'
        )->fetch(PDO::FETCH_ASSOC);

        $isConnectionSupported = is_array($connectionData)
            && isset($connectionData['charset'], $connectionData['collation'])
            && str_starts_with((string) $connectionData['charset'], 'utf8mb4')
            && str_starts_with((string) $connectionData['collation'], 'utf8mb4');

        if (!$isConnectionSupported) {
            return false;
        }

        $tableName = $this->getTableName($table);
        $statement = $connection->prepare(sprintf('SHOW FULL COLUMNS FROM `%s` LIKE :column', $tableName));
        $statement->execute(['column' => $column]);
        $columnData = $statement->fetch(PDO::FETCH_ASSOC);

        return is_array($columnData)
            && !empty($columnData['Collation'])
            && str_starts_with((string) $columnData['Collation'], 'utf8mb4');
    }

    /**
     * Create a direct PDO connection using Magento env.php database settings.
     *
     * @return PDO|null
     */
    private function createConnection(): ?PDO
    {
        try {
            $config = require dirname(__DIR__, 6) . '/app/etc/env.php';
            $connectionConfig = $config['db']['connection']['default'] ?? [];
            $hostConfig = (string) ($connectionConfig['host'] ?? '127.0.0.1');
            [$host, $port] = array_pad(explode(':', $hostConfig, 2), 2, null);
            $dsn = sprintf(
                'mysql:host=%s;dbname=%s%s',
                $host,
                (string) ($connectionConfig['dbname'] ?? ''),
                $port !== null ? ';port=' . $port : ''
            );

            return new PDO(
                $dsn,
                (string) ($connectionConfig['username'] ?? ''),
                (string) ($connectionConfig['password'] ?? ''),
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                ]
            );
        } catch (\Throwable $exception) {
            return null;
        }
    }

    /**
     * Resolve table name with optional Magento table prefix from env.php.
     *
     * @param string $table
     * @return string
     */
    private function getTableName(string $table): string
    {
        $config = require dirname(__DIR__, 6) . '/app/etc/env.php';
        $tablePrefix = (string) ($config['db']['table_prefix'] ?? '');

        return $tablePrefix . $table;
    }
}
